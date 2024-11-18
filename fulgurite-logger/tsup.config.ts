import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    outDir: 'dist',
    splitting: false, // ESM 일때는 꺼줘야함
    sourcemap: true, // 소스 맵 생성
    dts: true, // 타입 정의 파일 생성
    clean: true, // 이전 번들 파일 제거
    ...options,
}));
