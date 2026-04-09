# English Vocabulary Master

Ứng dụng học từ vựng tiếng Anh offline dành cho sinh viên.

## 1. Chức năng chính
- **5 Chủ đề**: Family, Food & Drinks, Animals, Transport, Weather.
- **50 Từ vựng**: Mỗi từ có phiên âm IPA, nghĩa tiếng Việt, câu ví dụ và âm thanh.
- **4 Kỹ năng**:
  - **Nghe**: Nghe âm thanh và chọn từ đúng.
  - **Nói (Giả lập)**: Hiển thị từ và IPA để tự luyện phát âm.
  - **Đọc**: Hiểu nghĩa từ trong ngữ cảnh câu ví dụ.
  - **Viết**: Nhập từ tiếng Anh dựa trên nghĩa tiếng Việt.
- **Kiểm tra**: Trắc nghiệm 10 câu cho mỗi chủ đề, tự động chấm điểm.
- **Tiến độ**: Lưu lịch sử học tập và điểm số cao nhất vào `localStorage`.

## 2. Cấu trúc thư mục âm thanh
Để ứng dụng phát được âm thanh, bạn cần đặt các file `.mp3` vào thư mục `public/audio/` theo cấu trúc sau:
- `public/audio/family/` (father.mp3, mother.mp3, ...)
- `public/audio/food/` (bread.mp3, milk.mp3, ...)
- `public/audio/animals/` (dog.mp3, cat.mp3, ...)
- `public/audio/transport/` (car.mp3, bus.mp3, ...)
- `public/audio/weather/` (sunny.mp3, rainy.mp3, ...)

*Lưu ý: Tên file phải trùng với trường `audioUrl` trong file `src/data/vocabulary.ts`.*

## 3. Hướng dẫn chạy ứng dụng
1. Cài đặt các dependencies: `npm install`
2. Chạy môi trường phát triển: `npm run dev`
3. Mở trình duyệt tại địa chỉ: `http://localhost:3000`

## 4. Công nghệ sử dụng
- **Frontend**: React 19, TypeScript, Tailwind CSS 4.
- **Animation**: Motion (framer-motion).
- **Icons**: Lucide React.
- **Storage**: LocalStorage API.
