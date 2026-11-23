"""
Cách 2: bỏ toàn bộ khung ngoài của logo, chỉ giữ nét logo với nền trong suốt.

Ảnh gốc: chữ L&C xanh + giọt màu, đặt trên nền trắng, bao quanh là
khung tròn vàng double-ring. Ta:
  1. Phát hiện khung vàng theo màu (vàng/cam) và xóa (đặt trong suốt).
  2. Xóa nền trắng -> trong suốt.
  3. Cắt (crop) sát vào phần nét còn lại của logo.
"""
from PIL import Image
import numpy as np

SRC = "public/images/logo-con-dau.png"
DST = "public/images/logo-con-dau.png"

img = Image.open(SRC).convert("RGBA")
a = np.array(img).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

# --- 1. Xóa khung vàng/cam bao ngoài ---
# Khung = các THÀNH PHẦN LIÊN THÔNG màu vàng LỚN (vòng tròn trải gần hết ảnh);
# giọt vàng trang trí là cụm nhỏ -> giữ nguyên.
from scipy import ndimage
yellow_all = (r > 150) & (g > 90) & (b < 160) & (r - b > 50) & (g - b > 15)
labels_y, n_y = ndimage.label(yellow_all)
yellow = np.zeros_like(yellow_all)
if n_y:
    h, w = r.shape
    for i in range(1, n_y + 1):
        comp = labels_y == i
        ys, xs = np.where(comp)
        span = max(ys.max() - ys.min(), xs.max() - xs.min())
        if span > 0.6 * max(h, w):  # vòng khung chạy dài gần hết ảnh
            yellow |= comp

# --- 2. Xóa nền trắng / gần trắng ---
white = (r > 225) & (g > 225) & (b > 225)

bg = yellow | white

# Chỉ xóa nền NỐI LIỀN với biên ảnh (tránh làm hỏng phần trắng BÊN TRONG
# nét chữ, ví dụ lỗ chữ e, c...). Flood fill từ biên.
from collections import deque
visited = np.zeros((h, w), bool)
dq = deque()
for x in range(w):
    for y in (0, h - 1):
        if bg[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if bg[y, x] and not visited[y, x]:
            visited[y, x] = True
            dq.append((y, x))
while dq:
    y, x = dq.popleft()
    for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
        if 0 <= ny < h and 0 <= nx < w and bg[ny, nx] and not visited[ny, nx]:
            visited[ny, nx] = True
            dq.append((ny, nx))

a[visited, 3] = 0

# --- 2b. Lấp lỗ thủng NHỎ bị flood-fill làm rách (lỗ trong giọt màu).
# Không đụng vào khoảng trong suốt LỚN bên trong các vòng chữ C, o.
from scipy import ndimage
transparent = a[..., 3] == 0
labels, n = ndimage.label(transparent)
# Miền trong suốt nối với biên ảnh = nền thật, giữ nguyên.
border_labels = set(np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]])))
holes = np.zeros_like(transparent)
for i in range(1, n + 1):
    if i not in border_labels:
        holes |= labels == i

# Lấp lỗ + TÔ LẠI MÀU: lan màu từ pixel đôi quanh lỗ vào trong (inpaint).
rgb = a[..., :3].astype(np.float64)
known = ~holes
working = rgb.copy()
weight = known.astype(np.float64)
if holes.any():
    working[holes] = 0
    for _ in range(400):
        if weight[holes].min() > 0:
            break
        w_sum = ndimage.uniform_filter(weight, size=3)
        for c in range(3):
            blurred = ndimage.uniform_filter(working[..., c] * weight, size=3)
            fill = (w_sum > 0) & holes & (weight == 0)
            working[..., c][fill] = blurred[fill] / w_sum[fill]
        newly = (w_sum > 0) & holes & (weight == 0)
        weight[newly] = 1
    a[..., :3][holes] = np.clip(working[holes], 0, 255).astype(np.int16)
    a[holes, 3] = 255

# --- 3. Crop sát nét logo ---
alpha = a[..., 3]
ys, xs = np.where(alpha > 8)
y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
pad = 4
y0 = max(0, y0 - pad); x0 = max(0, x0 - pad)
y1 = min(h - 1, y1 + pad); x1 = min(w - 1, x1 + pad)
a = a[y0:y1+1, x0:x1+1]

# Làm mịn mép đã bỏ — không cần thiết, giữ kết quả xóa nền + lấp lỗ.

out = Image.fromarray(a.astype(np.uint8))
out.save(DST)
print("saved", out.size)
