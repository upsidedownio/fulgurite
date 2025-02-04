import { Context, Next } from 'hono';
import { LRUCache } from 'lru-cache';
import { createMiddleware } from 'hono/factory';

/**
 * Cache instances by group
 * To use a group, you must register the cache instance in advance through registerCacheGroup().
 */
const groupCaches: Map<string, LRUCache<string, Response>> = new Map();

/**
 * 캐시 그룹을 사전에 등록합니다.
 *
 * @param group - 등록할 캐시 그룹명
 * @param options - LRUCache 인스턴스를 생성할 때 사용할 옵션 (예: max, ttl 등)
 *
 * @throws 등록된 그룹명과 중복될 경우 에러를 던집니다.
 */
export function registerCacheGroup(group: string, options?: LRUCache.Options<string, Response, unknown>): void {
    if (groupCaches.has(group)) {
        throw new Error(`Cache group '${group}' is already registered.`);
    }
    const cacheInstance = new LRUCache<string, Response>(options!);
    groupCaches.set(group, cacheInstance);
}

/**
 * TTL, 캐시 키(경로) 그리고 (선택적) 그룹명을 받아 캐시 미들웨어를 생성합니다.
 *
 * 미들웨어 동작:
 *  1. 요청 시 전달받은 cacheKeyPath 를 캐시 키로 사용하여, 해당 키가 캐시에 존재하면 캐시된 응답의 클론을 바로 반환합니다.
 *  2. 캐시가 없으면 다음 미들웨어(또는 핸들러)를 실행합니다.
 *  3. 응답이 생성되면, 해당 응답을 클론하여 캐시에 저장합니다.
 *
 * @param group - 캐시 그룹명; 그룹을 사용하려면 반드시 사전에 registerCacheGroup() 으로 등록되어 있어야 합니다.
 * @param ttl - 캐시 TTL (밀리초 단위)
 * @param cacheKeyPath - 캐시 키로 사용할 문자열 (예: API 엔드포인트 경로)
 *
 * @throws 만약 group 파라미터가 존재하는데 사전에 등록되지 않았다면 에러를 던집니다.
 */
export function cache(group: string, ttl?: number, cacheKeyPath?: string | ((c: Context) => string)) {
    return createMiddleware(async (c: Context, next: Next) => {
        let key: string = c.req.url;
        if (cacheKeyPath && typeof cacheKeyPath === 'function') {
            key = cacheKeyPath(c);
        } else if (cacheKeyPath) {
            key = cacheKeyPath;
        }

        // 사용할 캐시 인스턴스를 결정 (그룹이 지정된 경우 해당 그룹의 캐시 인스턴스 사용)
        let cacheInstance: LRUCache<string, Response>;
        if (!groupCaches.has(group)) {
            throw new Error(
                `Cache group '${group}' has not been registered. Please register it using registerCacheGroup().`,
            );
        }
        cacheInstance = groupCaches.get(group)!;

        // 캐시된 응답이 있다면 반환 (clone()을 통해 원본 Response 변경을 방지)
        const cachedResponse = cacheInstance.get(key);
        if (cachedResponse) {
            return cachedResponse.clone();
        }

        // 캐시가 없으면 다음 미들웨어(또는 라우터)를 실행
        await next();

        // 응답이 존재하면, 클론 후 캐시에 저장 (각 항목별 TTL 적용)
        if (c.res) {
            cacheInstance.set(key, c.res.clone(), { ttl });
        }
    });
}

/**
 * 지정한 그룹의 캐시 인스턴스 내 모든 항목을 제거합니다.
 *
 * @param group - 클리어할 캐시 그룹명
 *
 * @throws 해당 그룹이 등록되지 않았다면 에러를 던집니다.
 */
export function clearCacheByGroup(group: string): void {
    if (!groupCaches.has(group)) {
        throw new Error(`Cache group '${group}' is not registered.`);
    }
    groupCaches.get(group)!.clear();
}

/**
 * 기본 캐시와 모든 그룹 캐시 인스턴스의 항목을 모두 초기화합니다.
 */
export function clearAllCache(): void {
    for (const cacheInstance of groupCaches.values()) {
        cacheInstance.clear();
    }
}
