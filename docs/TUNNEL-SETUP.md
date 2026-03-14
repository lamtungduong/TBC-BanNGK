# Cấu hình Cloudflare Tunnel + Vercel (chuyển hướng API)

Khi user mở **https://tbc-fnb.vercel.app** (B), nếu tunnel tới server LAN (A) đang chạy và cấu hình đúng, mọi API và ảnh sẽ gọi qua tunnel — URL trình duyệt vẫn là Vercel.

## 1. Cloudflare Tunnel (bạn đã làm)

- Tạo tunnel (vd. tên `tbc`), lấy token.
- Add stack Cloudflare Tunnel trên Portainer (VM 100), nhập token.

## 2. Lấy URL public của tunnel

- Vào **Cloudflare Zero Trust Dashboard** → **Networks** → **Tunnels** → chọn tunnel `tbc`.
- Thêm **Public Hostname** (nếu chưa có):
  - Subdomain: ví dụ `tbc-fnb-lan` (hoặc dùng domain tùy chỉnh).
  - Service: **HTTP**, `localhost:3000` (hoặc IP:3000 nếu app chạy trên máy khác trong LAN).
- URL public sẽ dạng: `https://tbc-fnb-lan.<your-domain>.com` hoặc URL do Cloudflare cấp.

## 3. Cấu hình app

### Trên Vercel (build / runtime)

Trong **Vercel** → Project → **Settings** → **Environment Variables** thêm:

- **Name:** `NUXT_PUBLIC_TUNNEL_ORIGIN`
- **Value:** URL public tunnel (vd. `https://tbc-fnb-lan.xxx.com`) — **không** có dấu `/` cuối.
- Áp dụng cho: Production (và Preview nếu muốn).

Rồi **Redeploy** để biến có hiệu lực.

### Trên VM 100 (khi chạy app qua Portainer)

Nếu bạn build image và chạy container trên VM 100, **không cần** set `NUXT_PUBLIC_TUNNEL_ORIGIN` cho bản chạy trên LAN (truy cập qua `tbc.fnb` hoặc IP:3000). Biến này chỉ cần khi **frontend được serve từ Vercel** (để client biết gọi API qua tunnel).

## 4. CORS

Server LAN (app chạy trên VM 100) đã có middleware CORS (`src/server/middleware/0.cors.ts`) cho phép origin `https://tbc-fnb.vercel.app`. Không cần cấu hình thêm trên Cloudflare Tunnel cho CORS.

## 5. Kiểm tra

1. Deploy lại bản Vercel đã set `NUXT_PUBLIC_TUNNEL_ORIGIN`.
2. Đảm bảo tunnel trên Portainer đang chạy và public hostname trỏ đúng service (HTTP, port 3000).
3. Mở **https://tbc-fnb.vercel.app/admin** (hoặc trang chủ).
4. Mở DevTools → Network: request API và ảnh (vd. `/api/data/products`, `/api/blob-image?...`) phải gửi tới **URL tunnel** (origin của request = URL tunnel), còn thanh địa chỉ vẫn là `tbc-fnb.vercel.app`.

Nếu tunnel chưa chạy hoặc không reachable, app vẫn dùng API trên Vercel (same-origin).
