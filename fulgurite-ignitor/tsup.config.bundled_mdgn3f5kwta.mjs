// tsup.config.ts
import { defineConfig } from "tsup";
var tsup_config_default = defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "dist",
  splitting: false,
  // ESM 일때는 꺼줘야함
  sourcemap: true,
  // 소스 맵 생성
  dts: true,
  // 타입 정의 파일 생성
  clean: true,
  // 이전 번들 파일 제거
  ...options
}));
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL2hvbWUvbm9pemJ1c3Rlci9wcm9qZWN0cy9yZW1hZy5pby9saWJzL2Z1bGd1cml0ZS9mdWxndXJpdGUtaWduaXRvci90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS9ub2l6YnVzdGVyL3Byb2plY3RzL3JlbWFnLmlvL2xpYnMvZnVsZ3VyaXRlL2Z1bGd1cml0ZS1pZ25pdG9yXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9ob21lL25vaXpidXN0ZXIvcHJvamVjdHMvcmVtYWcuaW8vbGlicy9mdWxndXJpdGUvZnVsZ3VyaXRlLWlnbml0b3IvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChvcHRpb25zKSA9PiAoe1xuICAgIGVudHJ5OiBbJ3NyYy9pbmRleC50cyddLFxuICAgIGZvcm1hdDogWydlc20nLCAnY2pzJ10sXG4gICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgc3BsaXR0aW5nOiBmYWxzZSwgLy8gRVNNIFx1Qzc3Q1x1QjU0Q1x1QjI5NCBcdUFFQkNcdUM5MThcdUM1N0NcdUQ1NjhcbiAgICBzb3VyY2VtYXA6IHRydWUsIC8vIFx1QzE4Q1x1QzJBNCBcdUI5RjUgXHVDMEREXHVDMTMxXG4gICAgZHRzOiB0cnVlLCAvLyBcdUQwQzBcdUM3ODUgXHVDODE1XHVDNzU4IFx1RDMwQ1x1Qzc3QyBcdUMwRERcdUMxMzFcbiAgICBjbGVhbjogdHJ1ZSwgLy8gXHVDNzc0XHVDODA0IFx1QkM4OFx1QjRFNCBcdUQzMENcdUM3N0MgXHVDODFDXHVBQzcwXG4gICAgLi4ub3B0aW9ucyxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVYsU0FBUyxvQkFBb0I7QUFFcFgsSUFBTyxzQkFBUSxhQUFhLENBQUMsYUFBYTtBQUFBLEVBQ3RDLE9BQU8sQ0FBQyxjQUFjO0FBQUEsRUFDdEIsUUFBUSxDQUFDLE9BQU8sS0FBSztBQUFBLEVBQ3JCLFFBQVE7QUFBQSxFQUNSLFdBQVc7QUFBQTtBQUFBLEVBQ1gsV0FBVztBQUFBO0FBQUEsRUFDWCxLQUFLO0FBQUE7QUFBQSxFQUNMLE9BQU87QUFBQTtBQUFBLEVBQ1AsR0FBRztBQUNQLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
