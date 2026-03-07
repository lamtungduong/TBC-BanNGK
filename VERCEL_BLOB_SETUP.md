# Cấu hình Vercel Blob cho upload ảnh sản phẩm

Khi deploy lên Vercel, ảnh kéo-thả được lưu qua **Vercel Blob**. Bạn cần tạo Blob Store và cấu hình token một lần.

## Các bước thao tác

### 1. Cài dependency (đã thêm trong code)

```bash
npm install
```

### 2. Trên Vercel Dashboard

1. Vào [vercel.com](https://vercel.com) → chọn project POS của bạn.
2. Vào **Storage** (tab Storage trong project).
3. Chọn **Create Database** hoặc **Create Store** → chọn **Blob**.
4. Đặt tên (ví dụ: `pos-images`) → **Create**.
5. Sau khi tạo, vào tab **Settings** của Blob store (hoặc **.env** của project).
6. Copy biến môi trường **`BLOB_READ_WRITE_TOKEN`**.

### 3. Gắn token vào Project

1. Trong project Vercel: **Settings** → **Environment Variables**.
2. Thêm biến:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** (dán token vừa copy)
   - **Environment:** chọn Production (và Preview nếu muốn preview deploy cũng upload được).
3. **Save**.

### 4. Redeploy

Sau khi lưu env, cần deploy lại để áp dụng:

- **Deployments** → menu (...) của deployment mới nhất → **Redeploy**.

Hoặc push commit mới để tạo deployment mới.

---

## Kết quả

- **Local (localhost):** Ảnh vẫn lưu vào thư mục `src/public/images` (không cần token).
- **Vercel:** Nếu có `BLOB_READ_WRITE_TOKEN`, ảnh upload lên Vercel Blob và hiển thị bằng URL từ Blob. Kéo-thả ảnh sản phẩm hoạt động bình thường.

Sản phẩm đã có ảnh (tên file) từ trước vẫn hiển thị qua route `/images/...`. Chỉ ảnh upload mới trên Vercel sẽ dùng URL Blob.
