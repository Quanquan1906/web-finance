# PRD – Tài Liệu Yêu Cầu Sản Phẩm

# FinTrack AI – Ứng Dụng Quản Lý Thu Chi Cá Nhân Tích Hợp Trí Tuệ Nhân Tạo

---

| Thông tin | Nội dung |
|---|---|
| **Tên sản phẩm** | FinTrack AI |
| **Phiên bản PRD** | 1.0 |
| **Ngày tạo** | 2026-03-21 |
| **Người viết** | Senior PM / BA / Solution Analyst |
| **Trạng thái** | Draft – sẵn sàng review |
| **Đối tượng** | Team Design, Team Dev, Giảng viên hướng dẫn |
| **Ngôn ngữ sản phẩm** | Tiếng Việt |
| **Nền tảng** | Web App (React + TypeScript), Responsive Mobile |

---

## Mục lục

1. Tổng quan sản phẩm
2. Bối cảnh và vấn đề
3. Mục tiêu kinh doanh và mục tiêu người dùng
4. Đối tượng người dùng
5. Phạm vi chức năng
6. Danh sách tính năng chi tiết
7. User Stories
8. Functional Requirements
9. Business Rules
10. Quy trình nghiệp vụ / User Flow
11. Non-functional Requirements
12. Dữ liệu chính của hệ thống
13. Mô tả module AI/NLP
14. Phân chia phạm vi theo giai đoạn
15. Acceptance Criteria
16. Rủi ro và lưu ý triển khai
17. Giả định và điểm cần xác nhận
18. Kết luận

---

# 1. Tổng quan sản phẩm

## 1.1 Tên sản phẩm đề xuất

**FinTrack AI** – Ứng dụng Quản lý Thu Chi Cá Nhân Thông minh

## 1.2 Mô tả ngắn sản phẩm

FinTrack AI là một ứng dụng web quản lý tài chính cá nhân được xây dựng trên nền tảng React + TypeScript, tích hợp trí tuệ nhân tạo Gemini (Google GenAI) để hỗ trợ người dùng theo dõi thu nhập và chi tiêu một cách thông minh, trực quan và hiệu quả. Hệ thống cho phép người dùng nhập giao dịch theo nhiều cách – từ form thủ công đến câu lệnh ngôn ngữ tự nhiên và quét hóa đơn bằng OCR – đồng thời cung cấp báo cáo phân tích, chatbot tư vấn tài chính, phát hiện chi tiêu bất thường và gợi ý kế hoạch tiết kiệm.

## 1.3 Bài toán sản phẩm đang giải quyết

Phần lớn người Việt Nam trẻ – đặc biệt là sinh viên và người mới đi làm – không có thói quen theo dõi chi tiêu một cách có hệ thống. Các phương pháp ghi chép truyền thống (sổ tay, bảng tính Excel) thiếu trực quan, tốn thời gian nhập liệu và không cung cấp insight phân tích. Trong khi đó, các ứng dụng tài chính nước ngoài thường không phù hợp với thói quen và ngôn ngữ của người dùng Việt.

FinTrack AI giải quyết khoảng trống này bằng cách cung cấp một công cụ tiếng Việt, thân thiện, có khả năng hiểu ngôn ngữ tự nhiên và hỗ trợ AI để giảm rào cản nhập liệu, đồng thời nâng cao nhận thức tài chính của người dùng.

## 1.4 Mục tiêu chính của hệ thống

- Ghi nhận và quản lý toàn bộ các giao dịch thu chi cá nhân.
- Phân loại giao dịch theo danh mục một cách linh hoạt.
- Tính toán và hiển thị số dư tức thời.
- Cung cấp báo cáo và biểu đồ trực quan về tình hình tài chính.
- Hỗ trợ nhập liệu nhanh bằng ngôn ngữ tự nhiên tiếng Việt (NLP).
- Tích hợp AI để tư vấn tài chính, phát hiện bất thường và gợi ý tiết kiệm.
- Hỗ trợ quét hóa đơn bằng ảnh (OCR) để tự động trích xuất dữ liệu giao dịch.

## 1.5 Giá trị mang lại cho người dùng

- **Tiết kiệm thời gian**: Nhập liệu nhanh qua câu lệnh tự nhiên hoặc ảnh hóa đơn thay vì điền form thủ công.
- **Minh bạch tài chính**: Luôn biết rõ mình đã thu bao nhiêu, chi bao nhiêu, còn lại bao nhiêu.
- **Insight thông minh**: AI phân tích hành vi chi tiêu và đưa ra gợi ý cụ thể, hữu ích.
- **Trải nghiệm thân thiện**: Giao diện tiếng Việt, thiết kế hiện đại, dễ sử dụng ngay cả với người không quen dùng app tài chính.
- **Phát hiện sớm vấn đề**: Cảnh báo khi có chi tiêu bất thường hoặc vượt ngân sách.

## 1.6 Phạm vi dự án

Dự án bao gồm một ứng dụng web đơn trang (SPA) với giao diện responsive, hỗ trợ trên cả desktop và thiết bị di động. Hệ thống tích hợp với Google Gemini API để thực hiện các tác vụ AI/NLP. Phạm vi không bao gồm ứng dụng native iOS/Android, đồng bộ ngân hàng tự động (Open Banking), hay tích hợp thanh toán trực tuyến trong phiên bản đầu.

---

# 2. Bối cảnh và vấn đề

## 2.1 Các vấn đề người dùng thường gặp khi quản lý thu chi cá nhân

Quản lý tài chính cá nhân là một nhu cầu phổ biến nhưng thường bị người dùng trẻ bỏ qua do thiếu công cụ phù hợp. Những vấn đề điển hình bao gồm:

- **Không biết tiền đi đâu**: Cuối tháng không thể giải thích tại sao hết tiền, dù thu nhập đủ sống.
- **Ghi chép thủ công phức tạp**: Sổ tay hay Excel đòi hỏi kỷ luật cao, dễ bỏ giữa chừng sau vài ngày.
- **Thiếu phân tích**: Dù có ghi chép, người dùng thường không có kỹ năng phân tích dữ liệu để rút ra insight hành động.
- **Nhập liệu chậm và nhàm**: Phải điền nhiều trường (số tiền, ngày, danh mục, ghi chú) làm người dùng nản.
- **Không có cảnh báo sớm**: Không biết mình đang chi tiêu theo hướng tiêu cực cho đến khi đã hết tiền.
- **Ứng dụng nước ngoài khó dùng**: Giao diện tiếng Anh, không quen với đơn vị tiền tệ VNĐ, danh mục không phù hợp thói quen Việt.

## 2.2 Vì sao cần hệ thống này

Thị trường Việt Nam đang thiếu một ứng dụng quản lý tài chính cá nhân đáp ứng đồng thời ba yêu cầu: (1) giao diện tiếng Việt thân thiện, (2) tích hợp AI thực sự hữu ích, và (3) hỗ trợ nhập liệu tự nhiên không cần kỹ thuật. FinTrack AI lấp đầy khoảng trống này bằng cách kết hợp công nghệ AI tiên tiến (Gemini) với trải nghiệm người dùng được thiết kế cho người Việt.

## 2.3 Các pain points của người dùng

| Pain Point | Mô tả | Mức độ nghiêm trọng |
|---|---|---|
| Nhập liệu chậm | Điền form nhiều bước mỗi lần có giao dịch | Cao |
| Thiếu tổng quan | Không biết tổng chi/thu hiện tại | Cao |
| Phân loại sai | Giao dịch bị phân loại nhầm danh mục | Trung bình |
| Không có gợi ý | Không biết cần cắt giảm khoản nào | Cao |
| Quên nhập | Quên ghi lại giao dịch sau khi đã chi | Trung bình |
| Hóa đơn giấy | Phải tự đọc và gõ lại thông tin từ hóa đơn | Trung bình |

## 2.4 Cơ hội ứng dụng AI/NLP trong sản phẩm

Gemini API của Google cung cấp khả năng xử lý ngôn ngữ tự nhiên tiếng Việt và nhận diện hình ảnh rất mạnh, mở ra các cơ hội:

- **NLP nhập liệu**: Người dùng gõ "hôm nay ăn phở 50 ngàn" → AI tự động tách ra số tiền, loại chi, danh mục, ghi chú.
- **Chatbot tư vấn**: Người dùng hỏi về tình hình tài chính bằng tiếng Việt thông thường.
- **OCR hóa đơn**: Chụp ảnh hóa đơn → AI trích xuất tổng tiền, danh mục, ngày giờ.
- **Phân tích bất thường**: AI so sánh hành vi chi tiêu hiện tại với lịch sử để cảnh báo.
- **Gợi ý tiết kiệm**: AI đề xuất kế hoạch cắt giảm dựa trên dữ liệu thực tế.

---

# 3. Mục tiêu kinh doanh và mục tiêu người dùng

## 3.1 Mục tiêu kinh doanh

- **M1**: Xây dựng sản phẩm hoàn chỉnh phục vụ mục tiêu học thuật (đồ án môn học) với đầy đủ chức năng cốt lõi và mở rộng AI.
- **M2**: Thể hiện khả năng tích hợp AI (Gemini) vào ứng dụng thực tế, tạo điểm khác biệt so với các đồ án thông thường.
- **M3**: Xây dựng nền tảng có khả năng mở rộng thành sản phẩm thương mại sau khi hoàn thiện (future roadmap).
- **M4**: Đảm bảo hệ thống đáp ứng các tiêu chí đánh giá của giảng viên: đủ tính năng, kiến trúc rõ ràng, giao diện chuyên nghiệp.

## 3.2 Mục tiêu người dùng

- **U1**: Ghi lại mọi khoản thu chi hàng ngày một cách nhanh chóng, không mất quá 10 giây mỗi giao dịch.
- **U2**: Biết chính xác số dư hiện tại và tổng quan tài chính bất kỳ lúc nào.
- **U3**: Hiểu rõ mình đang chi tiêu nhiều nhất vào danh mục nào.
- **U4**: Nhận được gợi ý cụ thể để cải thiện thói quen tài chính.
- **U5**: Có thể hỏi AI bất kỳ câu hỏi nào về tài chính cá nhân và nhận được câu trả lời hữu ích.

## 3.3 Chỉ số thành công / KPI gợi ý

| KPI | Mô tả | Mục tiêu gợi ý |
|---|---|---|
| Số giao dịch được nhập | Đo lường mức độ sử dụng tính năng core | ≥ 10 GD/user/tháng |
| Tỷ lệ dùng NLP input | % giao dịch nhập qua NLP / tổng GD nhập | ≥ 30% |
| Tỷ lệ OCR thành công | % ảnh hóa đơn được xác nhận đúng / tổng ảnh | ≥ 70% |
| Độ chính xác NLP parsing | % câu NLP được parse đúng amount + type | ≥ 85% |
| Tỷ lệ sử dụng chatbot | % session có ít nhất 1 lần hỏi chatbot | ≥ 40% |
| Tỷ lệ người dùng quay lại | % user active trong tuần tiếp theo | ≥ 50% |
| Thời gian nhập 1 giao dịch | Đo lường từ click đến lưu thành công | ≤ 15 giây |

---

# 4. Đối tượng người dùng

FinTrack AI hướng đến ba nhóm người dùng chính với đặc điểm và nhu cầu khác nhau.

## 4.1 Persona 1 – Sinh viên đại học (Minh, 20 tuổi)

**Mô tả**: Sinh viên năm 3 tại TP.HCM, sống bằng tiền chu cấp từ gia đình (3–5 triệu/tháng). Hay quên ghi chép, cuối tháng thường bị thiếu tiền mà không rõ lý do.

**Nhu cầu**: Ứng dụng phải siêu đơn giản, nhập nhanh, không đòi hỏi kỹ năng tài chính. Muốn biết mình đã tiêu hết tiền vào đâu.

**Pain point chính**: Không có thói quen ghi chép, ngại điền form dài, hay quên giao dịch nhỏ lẻ.

**Kỳ vọng từ AI**: Có thể nhập bằng câu nói tự nhiên ("hôm nay ăn sáng 30k"), nhận cảnh báo khi gần hết budget.

---

## 4.2 Persona 2 – Người đi làm trẻ (Linh, 26 tuổi)

**Mô tả**: Nhân viên văn phòng, thu nhập 15–20 triệu/tháng. Có ý thức tiết kiệm nhưng chưa có kế hoạch rõ ràng. Dùng điện thoại nhiều trong ngày.

**Nhu cầu**: Theo dõi chi tiêu hàng tháng, biết mình đang tiêu bao nhiêu % cho từng danh mục, muốn đặt mục tiêu tiết kiệm.

**Pain point chính**: Có nhiều khoản chi phức tạp (ăn uống, đi lại, mua sắm online, cafe), khó phân loại chính xác. Hay có hóa đơn giấy từ siêu thị.

**Kỳ vọng từ AI**: Chatbot tư vấn "tôi nên cắt khoản nào?", OCR hóa đơn siêu thị, gợi ý kế hoạch tiết kiệm cụ thể.

---

## 4.3 Persona 3 – Người muốn kiểm soát tài chính nghiêm túc (Tuấn, 32 tuổi)

**Mô tả**: Làm việc tự do (freelancer), thu nhập không đều, có nhiều nguồn thu. Muốn phân tích sâu về dòng tiền.

**Nhu cầu**: Báo cáo phân tích chi tiết theo thời gian, phát hiện xu hướng, dự báo chi tiêu tháng tới.

**Pain point chính**: Khó phát hiện chi tiêu bất thường trong tháng bận, cần tool thông minh tự cảnh báo.

**Kỳ vọng từ AI**: Phân tích bất thường tự động, truy vấn tự nhiên ("tháng 3 tôi chi bao nhiêu cho cà phê?"), xu hướng dự báo.

---

# 5. Phạm vi chức năng

## 5.1 Chức năng cốt lõi bắt buộc (MVP)

Đây là tập hợp các chức năng bắt buộc phải hoàn thiện trong Phase 1, đáp ứng yêu cầu tối thiểu của đồ án.

### 5.1.1 Quản lý tài khoản người dùng
Hệ thống cung cấp chức năng đăng ký tài khoản, đăng nhập và quản lý hồ sơ cá nhân. Giao diện cài đặt cho phép người dùng cập nhật tên hiển thị. *(Lưu ý: từ code UI quan sát được, email là read-only sau khi đăng ký – xem phần Giả định.)*

### 5.1.2 Quản lý giao dịch
Chức năng trung tâm của hệ thống. Người dùng có thể thêm giao dịch mới (thu hoặc chi), chỉnh sửa giao dịch đã có, xoá giao dịch, và xem danh sách toàn bộ giao dịch với tìm kiếm và lọc theo ghi chú, danh mục.

### 5.1.3 Quản lý danh mục
Hệ thống cung cấp sẵn 6 danh mục mặc định: Ăn uống, Di chuyển, Giải trí, Tiết kiệm, Lương, Mua sắm. Người dùng có thể thêm danh mục tuỳ chỉnh với icon và màu sắc riêng, chỉnh sửa và xoá danh mục.

### 5.1.4 Dashboard và tổng quan tài chính
Trang chủ hiển thị 3 chỉ số chính: Tổng Thu, Tổng Chi, Số Dư. Kèm theo biểu đồ diện tích (Area Chart) thể hiện xu hướng thu chi theo tuần và danh sách 5 giao dịch gần nhất.

### 5.1.5 Thống kê và báo cáo
Trang Analytics cung cấp Pie Chart phân tích chi tiêu theo danh mục, Bar Chart so sánh thu vs chi theo 6 tháng, và bảng tổng hợp chi tiết với tỷ lệ phần trăm.

### 5.1.6 Tính toán số dư tự động
Hệ thống tự động tính: **Số Dư = Tổng Thu − Tổng Chi**, cập nhật tức thì khi có giao dịch mới.

## 5.2 Chức năng AI/NLP mở rộng (Phase 2)

### 5.2.1 Nhập liệu bằng ngôn ngữ tự nhiên (NLP Input)
Người dùng nhập câu mô tả giao dịch bằng tiếng Việt tự do. Gemini API phân tích và trích xuất: số tiền, loại (thu/chi), ghi chú, danh mục gợi ý. Kết quả được điền sẵn vào form để người dùng xác nhận trước khi lưu.

### 5.2.2 Chatbot tài chính đa chế độ
Giao diện chat tích hợp với 4 chế độ riêng biệt:
- **Chat truy vấn**: Hỏi đáp tự do về tình hình tài chính.
- **OCR Hóa đơn**: Upload ảnh hóa đơn để trích xuất thông tin.
- **Bất thường**: Phân tích và phát hiện chi tiêu bất thường.
- **Kế hoạch**: Lập kế hoạch tiết kiệm theo mục tiêu.

### 5.2.3 OCR nhận diện hóa đơn
Người dùng upload ảnh hóa đơn từ điện thoại hoặc camera. Gemini Vision API trích xuất: tổng tiền, danh mục gợi ý, ghi chú, ngày tháng. Kết quả hiển thị trong chat để người dùng xác nhận.

### 5.2.4 Phát hiện chi tiêu bất thường
AI phân tích lịch sử giao dịch, so sánh với mức trung bình và phát hiện các khoản chi bất thường hoặc lãng phí, cảnh báo người dùng thông qua chế độ Anomaly Detection.

### 5.2.5 Gợi ý kế hoạch tiết kiệm
AI đề xuất kế hoạch tiết kiệm cụ thể dựa trên thu nhập, chi tiêu hiện tại và mục tiêu tài chính của người dùng.

## 5.3 Tính năng bổ sung (Phase 3)

- Đồng bộ đa thiết bị và đa nền tảng (cloud sync).
- Chế độ Dark Mode (UI đã chuẩn bị toggle, chưa implement đầy đủ).
- Thông báo nhắc nhở hàng ngày (Daily Reminder notification).
- Báo cáo cá nhân hoá xuất file PDF/Excel.
- Đặt ngân sách (Budget) theo danh mục với cảnh báo vượt hạn mức.
- Tích hợp nhập liệu từ SMS/email ngân hàng.
- Dự báo xu hướng chi tiêu dựa trên mô hình AI.

---

# 6. Danh sách tính năng chi tiết

| Feature ID | Tên tính năng | Mô tả | Ưu tiên | Loại | Actor chính |
|---|---|---|---|---|---|
| F-001 | Đăng ký tài khoản | Người dùng tạo tài khoản mới với email và mật khẩu | Must Have | Core | Anonymous User |
| F-002 | Đăng nhập | Xác thực người dùng bằng email và mật khẩu | Must Have | Core | Registered User |
| F-003 | Đăng xuất | Kết thúc phiên làm việc an toàn | Must Have | Core | Logged-in User |
| F-004 | Cập nhật hồ sơ | Chỉnh sửa tên hiển thị, ảnh đại diện | Should Have | Core | Logged-in User |
| F-005 | Thêm giao dịch thủ công | Nhập giao dịch thu/chi qua form có validation | Must Have | Core | Logged-in User |
| F-006 | Chỉnh sửa giao dịch | Cập nhật thông tin giao dịch đã lưu | Must Have | Core | Logged-in User |
| F-007 | Xoá giao dịch | Xoá giao dịch khỏi hệ thống | Must Have | Core | Logged-in User |
| F-008 | Tìm kiếm giao dịch | Lọc giao dịch theo từ khoá ghi chú | Must Have | Core | Logged-in User |
| F-009 | Lọc giao dịch theo danh mục | Hiển thị giao dịch của một danh mục cụ thể | Should Have | Core | Logged-in User |
| F-010 | Quản lý danh mục | Xem, thêm, sửa, xoá danh mục thu chi | Must Have | Core | Logged-in User |
| F-011 | Dashboard tổng quan | Hiển thị Tổng Thu, Tổng Chi, Số Dư và biểu đồ | Must Have | Core | Logged-in User |
| F-012 | Biểu đồ thu chi tuần | Area Chart hiển thị xu hướng 7 ngày | Must Have | Core | Logged-in User |
| F-013 | Biểu đồ danh mục | Pie Chart chi tiêu theo danh mục | Must Have | Core | Logged-in User |
| F-014 | Biểu đồ so sánh 6 tháng | Bar Chart thu vs chi trong 6 tháng gần nhất | Should Have | Core | Logged-in User |
| F-015 | Bảng thống kê chi tiết | Bảng tổng hợp theo danh mục với tỷ lệ % | Should Have | Core | Logged-in User |
| F-016 | Tính số dư tự động | Tính toán và hiển thị Số Dư = Thu − Chi | Must Have | Core | System |
| F-017 | Nhập liệu NLP | Phân tích câu tiếng Việt thành dữ liệu giao dịch | Must Have | AI-NLP | Logged-in User |
| F-018 | Chatbot truy vấn | Hỏi đáp tự nhiên về tình hình tài chính | Should Have | AI-NLP | Logged-in User |
| F-019 | OCR hóa đơn | Trích xuất dữ liệu từ ảnh hóa đơn | Should Have | AI-NLP | Logged-in User |
| F-020 | Phát hiện bất thường | AI cảnh báo chi tiêu bất thường | Could Have | AI-NLP | System / AI |
| F-021 | Gợi ý tiết kiệm | AI đề xuất kế hoạch cắt giảm chi tiêu | Could Have | AI-NLP | System / AI |
| F-022 | Chat history | Lưu lịch sử các cuộc hội thoại với AI | Should Have | AI-NLP | Logged-in User |
| F-023 | Dark Mode | Chuyển đổi giao diện sáng/tối | Could Have | Enhancement | Logged-in User |
| F-024 | Thông báo nhắc nhở | Nhắc người dùng nhập giao dịch hàng ngày | Could Have | Enhancement | System |
| F-025 | Lọc theo thời gian | Lọc dữ liệu theo tháng này / tháng trước / tuỳ chọn | Should Have | Core | Logged-in User |
| F-026 | Xem giao dịch gần nhất | Danh sách 5 giao dịch mới nhất trên Dashboard | Must Have | Core | Logged-in User |

---

# 7. User Stories

## 7.1 Nhóm Authentication

**US-001 – Đăng ký tài khoản**
- As a new user (người dùng mới)
- I want to create an account with my email and password
- So that I can start tracking my personal finances securely

**US-002 – Đăng nhập**
- As a registered user (người dùng đã có tài khoản)
- I want to log in with my credentials
- So that I can access my financial data from any device

**US-003 – Đăng xuất**
- As a logged-in user
- I want to log out from the system
- So that my financial data is protected when I'm not using the device

**US-004 – Cập nhật hồ sơ**
- As a logged-in user
- I want to update my display name and profile picture
- So that the app feels personalized to me

---

## 7.2 Nhóm Transaction Management

**US-005 – Thêm giao dịch chi tiêu thủ công**
- As a logged-in user
- I want to add an expense transaction with amount, category, date, and note
- So that I can keep track of where my money is going

**US-006 – Thêm giao dịch thu nhập thủ công**
- As a logged-in user
- I want to add an income transaction
- So that the system can calculate my correct balance

**US-007 – Chỉnh sửa giao dịch**
- As a logged-in user
- I want to edit an existing transaction
- So that I can correct mistakes or update outdated information

**US-008 – Xoá giao dịch**
- As a logged-in user
- I want to delete a transaction
- So that I can remove incorrect or duplicate entries

**US-009 – Tìm kiếm giao dịch**
- As a logged-in user
- I want to search transactions by keyword
- So that I can quickly find a specific entry

**US-010 – Lọc giao dịch theo danh mục**
- As a logged-in user
- I want to filter transactions by category
- So that I can see all spending in a specific area

---

## 7.3 Nhóm Category Management

**US-011 – Xem danh sách danh mục**
- As a logged-in user
- I want to view all my spending categories
- So that I have an overview of how my finances are organized

**US-012 – Thêm danh mục mới**
- As a logged-in user
- I want to create a custom category with a name, icon, and color
- So that my financial tracking reflects my personal spending habits

**US-013 – Xoá danh mục**
- As a logged-in user
- I want to delete a category I no longer need
- So that my category list stays clean and relevant

---

## 7.4 Nhóm Dashboard & Analytics

**US-014 – Xem tổng quan tài chính**
- As a logged-in user
- I want to see my total income, total expenses, and current balance on the homepage
- So that I immediately know my financial status

**US-015 – Xem biểu đồ thu chi**
- As a logged-in user
- I want to see a visual chart of my income vs expenses over time
- So that I can understand spending trends at a glance

**US-016 – Xem chi tiêu theo danh mục**
- As a logged-in user
- I want to see a pie chart showing how much I spend in each category
- So that I can identify where most of my money goes

**US-017 – Xem số dư**
- As a logged-in user
- I want to always see my current balance (income minus expenses)
- So that I know how much money I have left

**US-018 – Lọc báo cáo theo tháng**
- As a logged-in user
- I want to filter analytics by current month, previous month, or custom range
- So that I can compare my finances across different time periods

---

## 7.5 Nhóm AI/NLP Features

**US-019 – Nhập giao dịch bằng ngôn ngữ tự nhiên**
- As a logged-in user
- I want to type a sentence like "hôm nay ăn sáng hết 50 ngàn" and have the AI understand it
- So that I can add transactions much faster without filling in every field

**US-020 – Xem kết quả parse NLP trước khi lưu**
- As a logged-in user
- I want to review and confirm the AI-parsed transaction data before saving
- So that I can correct any errors before they are stored

**US-021 – Hỏi chatbot về chi tiêu**
- As a logged-in user
- I want to ask the AI "tháng này tôi chi bao nhiêu cho ăn uống?"
- So that I can get instant answers about my financial data without manually searching

**US-022 – Chụp và upload ảnh hóa đơn**
- As a logged-in user
- I want to upload a photo of a receipt and have the AI extract the amount and details
- So that I don't have to manually type information from paper receipts

**US-023 – Xác nhận dữ liệu OCR**
- As a logged-in user
- I want to review OCR-extracted data before it is saved as a transaction
- So that inaccurate OCR results do not corrupt my financial records

**US-024 – Nhận gợi ý tiết kiệm từ AI**
- As a logged-in user
- I want the AI to suggest specific ways I can reduce spending
- So that I can improve my financial habits with actionable advice

**US-025 – Phát hiện chi tiêu bất thường**
- As a logged-in user
- I want the AI to alert me when I have an unusually high expense in any category
- So that I can catch overspending before it becomes a bigger problem

**US-026 – Chuyển đổi chế độ AI**
- As a logged-in user
- I want to switch between different AI modes (chat, OCR, anomaly, savings)
- So that I can get specialized assistance for each type of task

---

## 7.6 Nhóm Settings

**US-027 – Bật/tắt Dark Mode**
- As a logged-in user
- I want to toggle between light and dark interface themes
- So that I can use the app comfortably in different lighting conditions

**US-028 – Cấu hình thông báo**
- As a logged-in user
- I want to enable/disable daily reminders to log my transactions
- So that I can maintain a consistent tracking habit

---

# 8. Functional Requirements

## 8.1 Module Authentication

### FR-AUTH-01: Đăng ký tài khoản
- **Người dùng thực hiện**: Nhập email, mật khẩu, xác nhận mật khẩu và nhấn "Đăng ký".
- **Hệ thống phản hồi**: Tạo tài khoản mới, ghi nhận thông tin người dùng, chuyển hướng vào Dashboard.
- **Input**: email (string, valid format), password (string, ≥ 8 ký tự), confirm_password.
- **Output**: Tài khoản được tạo, người dùng đăng nhập tự động.
- **Validation**: Email phải đúng định dạng; password phải ≥ 8 ký tự; hai password phải khớp nhau; email chưa được đăng ký trước đó.

### FR-AUTH-02: Đăng nhập
- **Người dùng thực hiện**: Nhập email và mật khẩu, nhấn "Đăng nhập".
- **Hệ thống phản hồi**: Xác thực thông tin, tạo phiên làm việc (session/token), chuyển vào Dashboard.
- **Input**: email, password.
- **Output**: Session token được tạo, người dùng được chuyển vào ứng dụng.
- **Validation**: Email phải tồn tại trong hệ thống; mật khẩu phải khớp; sau 5 lần sai hệ thống khóa tạm thời.

### FR-AUTH-03: Đăng xuất
- **Người dùng thực hiện**: Hover vào avatar trong sidebar, chọn "Đăng xuất".
- **Hệ thống phản hồi**: Xóa session, chuyển hướng về trang đăng nhập.
- **Input**: Yêu cầu đăng xuất.
- **Output**: Session bị hủy, dữ liệu local bị xóa.

---

## 8.2 Module Transaction Management

### FR-TXN-01: Thêm giao dịch thủ công
- **Người dùng thực hiện**: Nhấn "Thêm giao dịch", điền form modal: số tiền, loại (thu/chi), danh mục, ngày, ghi chú → nhấn "Lưu giao dịch".
- **Hệ thống phản hồi**: Validate dữ liệu, lưu giao dịch, cập nhật tức thì danh sách và các chỉ số tổng quan, đóng modal.
- **Input**: amount (number > 0), type (income/expense), categoryId (valid ID), date (ISO string), note (string, optional).
- **Output**: Giao dịch mới xuất hiện đầu danh sách; Tổng Thu / Tổng Chi / Số Dư được cập nhật.
- **Validation**: Số tiền phải > 0; ngày không được để trống; danh mục phải được chọn.

### FR-TXN-02: Chỉnh sửa giao dịch
- **Người dùng thực hiện**: Nhấn icon chỉnh sửa trên một dòng trong bảng giao dịch.
- **Hệ thống phản hồi**: Mở modal pre-filled với dữ liệu hiện tại, cho phép chỉnh sửa, lưu lại.
- **Input**: Dữ liệu mới của giao dịch (tương tự FR-TXN-01).
- **Output**: Giao dịch được cập nhật; các chỉ số tổng quan được tính lại.
- **Validation**: Tương tự FR-TXN-01.

### FR-TXN-03: Xoá giao dịch
- **Người dùng thực hiện**: Nhấn icon Trash trên dòng giao dịch.
- **Hệ thống phản hồi**: *(Giả định)* Hiển thị dialog xác nhận → người dùng xác nhận → xóa giao dịch khỏi danh sách.
- **Input**: Transaction ID.
- **Output**: Giao dịch bị xóa; Tổng Thu / Tổng Chi / Số Dư được tính lại.
- **Business rule**: Nên có bước xác nhận trước khi xoá để tránh xóa nhầm.

### FR-TXN-04: Tìm kiếm giao dịch
- **Người dùng thực hiện**: Nhập từ khoá vào ô tìm kiếm.
- **Hệ thống phản hồi**: Lọc danh sách giao dịch real-time theo ghi chú chứa từ khoá.
- **Input**: keyword (string).
- **Output**: Danh sách giao dịch được lọc.
- **Validation**: Tìm kiếm case-insensitive; không phân biệt dấu tiếng Việt *(giả định, cần xác nhận).*

---

## 8.3 Module Category Management

### FR-CAT-01: Thêm danh mục
- **Người dùng thực hiện**: Nhấn "Thêm danh mục", nhập tên, chọn icon và màu sắc.
- **Hệ thống phản hồi**: Tạo danh mục mới, hiển thị trong grid.
- **Input**: name (string, bắt buộc), icon (emoji), color (CSS class).
- **Output**: Danh mục mới xuất hiện trong danh sách và dropdown giao dịch.
- **Validation**: Tên danh mục không được trùng với danh mục đã có; không được để trống.

### FR-CAT-02: Xoá danh mục
- **Người dùng thực hiện**: Hover vào card danh mục, nhấn icon Trash.
- **Hệ thống phản hồi**: *(Giả định)* Kiểm tra xem danh mục có giao dịch liên kết không. Nếu có, cảnh báo người dùng. Nếu không, xóa.
- **Business rule**: Danh mục mặc định của hệ thống không được phép xóa *(giả định).*

---

## 8.4 Module Dashboard & Reports

### FR-DASH-01: Tính toán và hiển thị tổng quan
- **Hệ thống**: Tự động tính tổng thu, tổng chi và số dư từ toàn bộ giao dịch của người dùng.
- **Output**: Ba card summary: Tổng Thu (xanh), Tổng Chi (đỏ), Số Dư (xanh dương).
- **Business rule**: Số Dư = ∑(income) − ∑(expense). Nếu Số Dư âm, hiển thị màu đỏ cảnh báo.

### FR-DASH-02: Hiển thị biểu đồ Area Chart
- **Hệ thống**: Render biểu đồ Area Chart thu vs chi theo 7 ngày gần nhất (mặc định) hoặc theo khoảng thời gian đã chọn.
- **Output**: Biểu đồ 2 đường (thu – xanh, chi – đỏ) với gradient fill.

### FR-DASH-03: Danh sách giao dịch gần nhất
- **Hệ thống**: Hiển thị tối đa 5 giao dịch mới nhất kèm icon danh mục, ghi chú và số tiền.
- **Output**: Danh sách có link "Xem tất cả" chuyển đến trang Transactions.

---

## 8.5 Module NLP Input Processing

### FR-NLP-01: Phân tích câu ngôn ngữ tự nhiên
- **Người dùng thực hiện**: Nhấn "Nhập nhanh (NLP)", nhập câu mô tả giao dịch bằng tiếng Việt.
- **Hệ thống phản hồi**: Gọi Gemini API (model gemini-3-flash-preview), nhận kết quả JSON có cấu trúc gồm: amount, type, note, suggestedCategory.
- **Input**: Chuỗi văn bản tiếng Việt tự do (ví dụ: "Hôm nay ăn sáng phở hết 50 ngàn").
- **Output**: Form giao dịch được điền sẵn với dữ liệu đã parse; người dùng review và confirm.
- **Validation**: Nếu API không trả về kết quả hợp lệ, hiển thị lỗi và yêu cầu nhập lại.
- **Business rule**: Người dùng phải xác nhận dữ liệu NLP trước khi lưu (không auto-save).

---

## 8.6 Module Natural Language Query (Chatbot)

### FR-CHAT-01: Gửi câu hỏi chatbot
- **Người dùng thực hiện**: Nhập câu hỏi vào chat composer, nhấn Send hoặc Enter.
- **Hệ thống phản hồi**: Gọi Gemini chat API với system instruction phù hợp theo mode đang chọn.
- **Input**: Câu hỏi text; context mode (chat/ocr/anomaly/savings); lịch sử hội thoại.
- **Output**: Phản hồi từ AI hiển thị trong bubble chat.
- **Validation**: Input không được để trống (button Send bị disable khi input rỗng).

### FR-CHAT-02: Chuyển đổi chế độ AI
- **Người dùng thực hiện**: Nhấn dropdown mode selector ở header chat, chọn chế độ.
- **Hệ thống phản hồi**: Cập nhật mode; system instruction của AI thay đổi theo mode mới.
- **4 chế độ**: Chat truy vấn, OCR Hóa đơn, Bất thường, Kế hoạch.

---

## 8.7 Module Receipt OCR

### FR-OCR-01: Upload và xử lý ảnh hóa đơn
- **Người dùng thực hiện**: Nhấn icon paperclip trong chat hoặc chọn mode OCR, upload ảnh hóa đơn.
- **Hệ thống phản hồi**: Đọc file ảnh, convert sang base64, gọi Gemini Vision API (model gemini-2.5-flash-image), nhận JSON kết quả gồm: tong_tien, danh_muc_goi_y, ghi_chu, ngay_thang.
- **Input**: File ảnh (jpg/png/webp, tối đa *(giả định)* 5MB).
- **Output**: Kết quả trích xuất hiển thị trong chat dưới dạng text có cấu trúc.
- **Business rule**: Kết quả OCR chỉ được lưu thành giao dịch sau khi người dùng xác nhận rõ ràng.

---

## 8.8 Module AI Recommendation & Anomaly Detection

### FR-AI-01: Phát hiện chi tiêu bất thường
- **Hệ thống / Người dùng**: Trong chế độ Anomaly, người dùng yêu cầu AI phân tích chi tiêu.
- **Hệ thống phản hồi**: AI nhận dữ liệu giao dịch, so sánh với trung bình lịch sử và xác định các giao dịch bất thường.
- **Output**: Danh sách các khoản chi bất thường kèm giải thích.

### FR-AI-02: Gợi ý kế hoạch tiết kiệm
- **Hệ thống / Người dùng**: Trong chế độ Savings, người dùng mô tả mục tiêu tiết kiệm.
- **Hệ thống phản hồi**: AI đề xuất kế hoạch cắt giảm chi tiêu cụ thể theo từng danh mục.
- **Output**: Kế hoạch tiết kiệm có cấu trúc với các bước hành động cụ thể.

---

## 8.9 Module Settings

### FR-SET-01: Cập nhật hồ sơ
- **Người dùng thực hiện**: Truy cập Settings → Hồ sơ cá nhân → chỉnh sửa tên hiển thị → lưu.
- **Input**: display_name (string).
- **Output**: Tên hiển thị được cập nhật trong sidebar và header.

### FR-SET-02: Bật/tắt Dark Mode
- **Người dùng thực hiện**: Toggle Dark Mode switch trong Settings.
- **Hệ thống phản hồi**: Chuyển đổi theme toàn bộ ứng dụng.

### FR-SET-03: Cấu hình thông báo
- **Người dùng thực hiện**: Bật/tắt "Nhắc nhở hàng ngày".
- **Hệ thống phản hồi**: Lưu tùy chọn thông báo; hệ thống gửi/không gửi thông báo hàng ngày.

---

# 9. Business Rules

**BR-001**: Số tiền của mọi giao dịch phải là số nguyên dương, tối thiểu là 1 VNĐ.

**BR-002**: Mỗi giao dịch phải thuộc về đúng một danh mục (bắt buộc). Không cho phép giao dịch không có danh mục.

**BR-003**: Loại giao dịch chỉ có hai giá trị hợp lệ: `income` (thu nhập) và `expense` (chi tiêu).

**BR-004**: Số Dư = Tổng cộng tất cả giao dịch income − Tổng cộng tất cả giao dịch expense. Được tính lại mỗi khi có thêm, sửa hoặc xóa giao dịch.

**BR-005**: Ngày giao dịch không được để trống. Hệ thống mặc định điền ngày hiện tại khi mở form thêm mới.

**BR-006**: Giao dịch nhập qua NLP bắt buộc phải qua bước xác nhận của người dùng (review form) trước khi được lưu vào hệ thống.

**BR-007**: Dữ liệu từ OCR hóa đơn bắt buộc phải qua bước xác nhận của người dùng trước khi được lưu thành giao dịch.

**BR-008**: AI chatbot chỉ có vai trò tư vấn, tham khảo. Hệ thống không tự động thực hiện bất kỳ thay đổi dữ liệu nào dựa trên phản hồi của AI mà không có hành động xác nhận từ người dùng.

**BR-009**: Tên danh mục trong cùng một tài khoản người dùng phải là duy nhất (unique). Không cho phép tạo hai danh mục có cùng tên.

**BR-010**: Khi xoá danh mục có giao dịch liên kết, hệ thống phải cảnh báo và yêu cầu người dùng chuyển các giao dịch sang danh mục khác hoặc xác nhận hủy luôn. Không xóa dữ liệu ngầm.

**BR-011**: Ngôn ngữ xử lý NLP là tiếng Việt. Hệ thống cần chuẩn hóa các đơn vị tiền tệ phổ biến: "k" / "nghìn" → 1,000 VNĐ; "triệu" / "tr" → 1,000,000 VNĐ; "tỷ" → 1,000,000,000 VNĐ.

**BR-012**: Mọi dữ liệu tài chính của người dùng phải được cách ly hoàn toàn theo tài khoản. Người dùng A không được phép truy cập dữ liệu của người dùng B dưới bất kỳ hình thức nào.

**BR-013**: Truy vấn NLP liên quan đến thời gian phải được chuẩn hóa về khoảng thời gian cụ thể (date range) trước khi gọi API AI. Ví dụ: "tháng này" → [đầu tháng hiện tại, ngày hiện tại]; "tháng trước" → [đầu tháng trước, cuối tháng trước].

**BR-014**: Hệ thống ghi log (không hiển thị) mọi lần gọi AI API, bao gồm timestamp, mode, độ dài input và kết quả (success/failure), để phục vụ debug và cải thiện sau này.

---

# 10. Quy trình nghiệp vụ / User Flow

## 10.1 Luồng Đăng ký

1. Người dùng truy cập ứng dụng → Landing page / trang Đăng nhập.
2. Nhấn "Tạo tài khoản mới".
3. Nhập email, mật khẩu, xác nhận mật khẩu.
4. Hệ thống validate: định dạng email, độ mạnh mật khẩu, khớp mật khẩu.
5. Nếu hợp lệ: tạo tài khoản, tạo session, khởi tạo danh mục mặc định.
6. Chuyển hướng đến Dashboard (lần đầu sẽ hiển thị empty state hướng dẫn).

## 10.2 Luồng Đăng nhập

1. Người dùng nhập email và mật khẩu.
2. Hệ thống verify credentials.
3. Nếu đúng: tạo session token, chuyển vào Dashboard.
4. Nếu sai: hiển thị lỗi "Email hoặc mật khẩu không đúng".
5. Sau 5 lần sai liên tiếp: tạm khóa 15 phút *(giả định).*

## 10.3 Luồng Thêm giao dịch thủ công

1. Người dùng vào trang "Giao Dịch".
2. Nhấn nút "Thêm giao dịch" (góc trên phải).
3. Modal "Thêm giao dịch mới" mở ra.
4. Nhập số tiền (number input).
5. Chọn loại: "Chi tiêu" hoặc "Thu nhập" (toggle).
6. Chọn danh mục từ dropdown.
7. Ghi chú (optional).
8. Ngày (tự động là hôm nay, có thể đổi).
9. Nhấn "Lưu giao dịch".
10. Hệ thống validate → Lưu → Đóng modal → Cập nhật danh sách và tổng quan.

## 10.4 Luồng Nhập giao dịch bằng câu tự nhiên (NLP)

1. Người dùng nhấn nút "Nhập nhanh (NLP)" trên trang Giao Dịch.
2. Modal NLP mở ra với textarea.
3. Người dùng gõ câu tiếng Việt, ví dụ: *"Hôm nay ăn sáng phở tái hết 50 nghìn".*
4. Nhấn "Phân tích và nhập liệu".
5. Hệ thống gọi Gemini API, hiển thị trạng thái "Đang phân tích...".
6. Kết quả trả về (amount: 50000, type: expense, note: "Ăn sáng phở tái").
7. Modal NLP đóng; Modal form giao dịch mở ra với dữ liệu đã điền sẵn.
8. Người dùng review, điều chỉnh nếu cần (đặc biệt là danh mục).
9. Nhấn "Lưu giao dịch" → Lưu thành công.
10. Nếu API lỗi: hiển thị thông báo "Không thể hiểu nội dung này. Hãy thử lại!".

## 10.5 Luồng Truy vấn chi tiêu bằng ngôn ngữ tự nhiên (Chatbot)

1. Người dùng vào trang "AI / Trợ Lý".
2. Chọn chế độ "Chat truy vấn" (mặc định).
3. Nhập câu hỏi, ví dụ: *"Tôi đã chi bao nhiêu cho ăn uống trong tháng 10?"*
4. Nhấn Send hoặc Enter.
5. Hệ thống gửi câu hỏi + system instruction "tài chính cá nhân" đến Gemini.
6. AI phản hồi xuất hiện trong bubble chat.
7. Người dùng có thể tiếp tục hỏi hoặc chuyển chế độ.

## 10.6 Luồng Xem Dashboard và báo cáo

1. Người dùng vào Dashboard (trang chủ).
2. Đọc ngay 3 chỉ số: Tổng Thu / Tổng Chi / Số Dư.
3. Xem biểu đồ Area Chart thu chi 7 ngày.
4. Xem 5 giao dịch gần nhất.
5. Nhấn "Xem tất cả" để đến trang Giao Dịch chi tiết.
6. Vào trang Thống Kê để xem Pie Chart và Bar Chart.
7. Có thể thay đổi bộ lọc thời gian (tháng này / tháng trước / tuỳ chọn).

## 10.7 Luồng Chụp và xử lý ảnh hóa đơn (OCR)

1. Người dùng vào trang "AI / Trợ Lý".
2. Chọn chế độ "OCR Hóa đơn" hoặc nhấn icon Paperclip trong chat.
3. Trình duyệt mở file picker, người dùng chọn ảnh hóa đơn.
4. Hệ thống đọc file, convert sang base64.
5. Gọi Gemini Vision API (gemini-2.5-flash-image).
6. Kết quả JSON trả về được hiển thị trong chat: tổng tiền, danh mục, ghi chú, ngày.
7. Người dùng xem kết quả và quyết định lưu hoặc không.
8. Nếu muốn lưu: *(giả định)* copy dữ liệu sang form tạo giao dịch thủ công để xác nhận.

## 10.8 Luồng Nhận gợi ý tiết kiệm / Phát hiện bất thường

1. Người dùng vào trang "AI / Trợ Lý".
2. Chọn chế độ "Bất thường" hoặc "Kế hoạch".
3. Nhập yêu cầu, ví dụ: *"Hãy phân tích chi tiêu của tôi và tìm điểm bất thường".*
4. Hệ thống gửi câu hỏi + context dữ liệu giao dịch đến AI.
5. AI trả về phân tích chi tiết với các khuyến nghị hành động.
6. Người dùng đọc và tự quyết định có áp dụng hay không.

---

# 11. Non-functional Requirements

## 11.1 Usability (Khả năng sử dụng)

- Giao diện phải được hoàn toàn bằng tiếng Việt, kể cả các thông báo lỗi.
- Người dùng phổ thông (không có kiến thức kỹ thuật) có thể hoàn thành thao tác thêm giao dịch lần đầu mà không cần hướng dẫn.
- Thời gian học dùng (time-to-learn) cho chức năng cơ bản phải ≤ 5 phút.
- Các nút hành động quan trọng phải đủ lớn, dễ thấy và có màu sắc phân biệt rõ ràng.
- Hệ thống cung cấp phản hồi rõ ràng cho mọi hành động của người dùng (loading state, success toast, error message).

## 11.2 Performance (Hiệu suất)

- Các trang nội bộ (không gọi AI) phải load trong vòng ≤ 2 giây trên kết nối 4G thông thường.
- Phân tích NLP qua Gemini API phải hoàn thành trong ≤ 5 giây trong điều kiện bình thường.
- OCR hóa đơn phải hoàn thành trong ≤ 8 giây.
- Chatbot phải bắt đầu stream phản hồi trong ≤ 3 giây sau khi gửi câu hỏi.
- Biểu đồ và bảng thống kê phải render trong ≤ 1 giây.

## 11.3 Security (Bảo mật)

- Mật khẩu người dùng phải được hash bằng bcrypt (hoặc tương đương) trước khi lưu.
- Mọi kết nối phải sử dụng HTTPS.
- API Key của Gemini phải được lưu ở server-side hoặc biến môi trường (.env), không được expose ra client.
- Token xác thực phải có thời hạn (expiry) và hỗ trợ refresh.
- Hệ thống phải chống lại CSRF, XSS và SQL Injection.

## 11.4 Privacy (Quyền riêng tư)

- Dữ liệu tài chính của người dùng phải được cách ly hoàn toàn theo tài khoản.
- Ảnh hóa đơn upload cho OCR không được lưu lại trên server sau khi xử lý xong.
- Không chia sẻ dữ liệu người dùng với bên thứ ba trừ Gemini API (chỉ trong phạm vi xử lý, không lưu trữ lâu dài bởi Google theo policy hiện tại).

## 11.5 Reliability (Độ tin cậy)

- Hệ thống phải xử lý gracefully các trường hợp Gemini API không khả dụng (timeout, rate limit): hiển thị thông báo thân thiện, không crash ứng dụng.
- Dữ liệu giao dịch phải được lưu trong database bền vững, không mất khi refresh trang.
- Hệ thống phải có cơ chế retry cho các API call thất bại (tối đa 3 lần).

## 11.6 Scalability (Khả năng mở rộng)

- Kiến trúc frontend (React SPA) phải dễ dàng tích hợp thêm module mới mà không ảnh hưởng đến các module hiện có.
- Backend API (khi triển khai) phải được thiết kế theo chuẩn RESTful hoặc GraphQL, dễ mở rộng.
- Hệ thống phải hỗ trợ ít nhất 100 người dùng đồng thời trong giai đoạn đồ án.

## 11.7 Maintainability (Khả năng bảo trì)

- Code phải tuân theo TypeScript strict mode, có type annotation đầy đủ.
- Components React phải được tổ chức theo nguyên tắc Single Responsibility.
- Service calls đến AI API phải được tập trung trong một module duy nhất (`geminiService.ts`), dễ swap provider nếu cần.
- Có file README.md hướng dẫn cài đặt và chạy ứng dụng.

## 11.8 Compatibility (Tương thích)

- Giao diện phải responsive, hoạt động tốt trên màn hình desktop (≥ 1024px), tablet (768–1023px) và mobile (< 768px).
- Phải hoạt động trên các trình duyệt hiện đại: Chrome 110+, Firefox 110+, Safari 16+, Edge 110+.
- Sidebar thu gọn thành hamburger menu trên mobile.

---

# 12. Dữ liệu chính của hệ thống

## 12.1 User (Người dùng)

**Mục đích**: Lưu thông tin tài khoản và xác thực người dùng.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string (UUID) | Định danh duy nhất |
| email | string | Email đăng nhập (unique) |
| passwordHash | string | Mật khẩu đã mã hóa |
| displayName | string | Tên hiển thị |
| avatarInitials | string | 2 ký tự đại diện (VD: "JS") |
| createdAt | datetime | Ngày tạo tài khoản |
| preferences | object | Tuỳ chọn cá nhân (theme, notifications) |

**Quan hệ**: Một User có nhiều Transaction, nhiều Category.

---

## 12.2 Transaction (Giao dịch)

**Mục đích**: Đơn vị dữ liệu trung tâm, lưu mọi khoản thu chi.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh duy nhất |
| amount | number | Số tiền (VNĐ, integer > 0) |
| type | enum | "income" hoặc "expense" |
| categoryId | string | FK đến Category |
| date | string (ISO) | Ngày giao dịch (YYYY-MM-DD) |
| note | string | Ghi chú mô tả |
| createdAt | datetime | Thời điểm tạo bản ghi |
| userId | string | FK đến User |
| source | enum | "manual" / "nlp" / "ocr" – nguồn nhập liệu |

**Quan hệ**: Một Transaction thuộc về một User và một Category.

---

## 12.3 Category (Danh mục)

**Mục đích**: Phân loại giao dịch theo chủ đề chi tiêu.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh duy nhất |
| name | string | Tên danh mục (VD: "Ăn uống") |
| icon | string | Emoji icon (VD: "🍴") |
| color | string | CSS class màu nền (VD: "bg-orange-500") |
| isDefault | boolean | True nếu là danh mục hệ thống |
| userId | string | FK đến User (null nếu là default) |

**Quan hệ**: Một Category thuộc về một User (hoặc là global default); có nhiều Transaction.

---

## 12.4 Financial Summary (Tóm tắt tài chính)

**Mục đích**: *(Giả định – computed/cached)* Lưu hoặc tính toán nhanh tổng quan tài chính theo khoảng thời gian.

| Trường | Kiểu | Mô tả |
|---|---|---|
| userId | string | FK đến User |
| period | string | "YYYY-MM" hoặc khoảng tùy chọn |
| totalIncome | number | Tổng thu trong kỳ |
| totalExpense | number | Tổng chi trong kỳ |
| balance | number | Số dư = totalIncome − totalExpense |
| calculatedAt | datetime | Thời điểm tính toán |

---

## 12.5 AI Insight (Phân tích AI)

**Mục đích**: *(Giả định)* Lưu kết quả phân tích AI để tránh gọi lại API nhiều lần.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh |
| userId | string | FK đến User |
| type | enum | "anomaly" / "savings" / "forecast" |
| content | text | Nội dung phân tích AI |
| generatedAt | datetime | Thời điểm tạo |
| isRead | boolean | Người dùng đã đọc chưa |

---

## 12.6 OCR Receipt (Hóa đơn OCR)

**Mục đích**: Lưu trạng thái xử lý và kết quả từ ảnh hóa đơn.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh |
| userId | string | FK đến User |
| extractedData | JSON | Dữ liệu trích xuất: tong_tien, danh_muc_goi_y, ghi_chu, ngay_thang |
| confirmed | boolean | Người dùng đã xác nhận chưa |
| linkedTransactionId | string / null | GD được tạo sau khi xác nhận |
| processedAt | datetime | Thời điểm OCR xử lý |

**Lưu ý**: File ảnh gốc không được lưu lâu dài, chỉ xử lý in-memory.

---

## 12.7 Chat Query / NLP Query Log (Lịch sử truy vấn)

**Mục đích**: Lưu lịch sử hội thoại với chatbot AI để phục vụ chat history và cải thiện chất lượng.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh |
| userId | string | FK đến User |
| sessionId | string | Nhóm các tin nhắn theo phiên chat |
| role | enum | "user" / "assistant" |
| content | text | Nội dung tin nhắn |
| mode | enum | "chat" / "ocr" / "anomaly" / "savings" |
| timestamp | datetime | Thời điểm gửi |
| attachments | string[] | Đường dẫn ảnh đính kèm (nếu có) |

---

## 12.8 Notification (Thông báo)

**Mục đích**: Quản lý thông báo hệ thống gửi đến người dùng.

| Trường | Kiểu | Mô tả |
|---|---|---|
| id | string | Định danh |
| userId | string | FK đến User |
| type | enum | "reminder" / "anomaly_alert" / "system" |
| title | string | Tiêu đề thông báo |
| message | string | Nội dung thông báo |
| isRead | boolean | Đã đọc chưa |
| createdAt | datetime | Thời điểm tạo |

---

# 13. Mô tả module AI/NLP

## 13.1 NLP Nhập liệu tự nhiên

**Mục đích**: Giảm ma sát khi nhập giao dịch bằng cách cho phép người dùng gõ câu tự nhiên tiếng Việt.

**Cơ chế hoạt động**:
Hệ thống sử dụng Gemini API (model `gemini-3-flash-preview`) với `responseMimeType: "application/json"` và schema cố định để đảm bảo output có cấu trúc. Prompt được thiết kế để parse câu tiếng Việt thành 4 trường: `amount` (số tiền), `type` (income/expense), `note` (mô tả), `suggestedCategory` (danh mục gợi ý).

**Ví dụ đầu vào và đầu ra**:

| Câu nhập | amount | type | note | suggestedCategory |
|---|---|---|---|---|
| "Hôm nay ăn sáng phở hết 50k" | 50000 | expense | Ăn sáng phở | Food |
| "Nhận lương tháng 10 được 15 triệu" | 15000000 | income | Lương tháng 10 | Salary |
| "Đổ xăng 200 nghìn" | 200000 | expense | Đổ xăng | Transport |

**Giới hạn và lưu ý**:
- Hệ thống cần chuẩn hóa đơn vị tiền trước khi gửi lên API (hoặc để Gemini xử lý).
- Danh mục gợi ý từ AI (tiếng Anh) cần được mapping sang danh mục tiếng Việt của người dùng.
- Trường hợp câu mơ hồ (ví dụ: "tiêu 100k"), AI có thể không xác định được danh mục → hệ thống để trống, người dùng tự chọn.

---

## 13.2 NLP Truy vấn dữ liệu (Chatbot Chat Mode)

**Mục đích**: Cho phép người dùng hỏi về tình hình tài chính bằng tiếng Việt thông thường.

**Cơ chế hoạt động**:
Hệ thống gọi Gemini Chat API với system instruction dạng tư vấn tài chính cá nhân. Lý tưởng nhất là trước khi gọi API, hệ thống nên inject dữ liệu giao dịch thực của người dùng vào context để AI có thể trả lời câu hỏi cụ thể.

**Các loại câu hỏi điển hình**:
- Truy vấn tổng hợp: "Tháng này tôi đã tiêu bao nhiêu?"
- Truy vấn theo danh mục: "Tôi chi bao nhiêu cho ăn uống tháng 10?"
- Truy vấn so sánh: "Tháng này tôi có chi nhiều hơn tháng trước không?"
- Câu hỏi mở: "Tôi có đang tiết kiệm đủ không?"

**Giới hạn của chatbot**:
- Không thể thực hiện hành động (không tự thêm/sửa/xóa giao dịch).
- Độ chính xác phụ thuộc vào lượng dữ liệu giao dịch và cách người dùng đặt câu hỏi.
- Không thể truy cập thông tin tài khoản ngân hàng thực tế.
- Đôi khi có thể "hallucinate" số liệu nếu context không đủ rõ – cần có disclaimer.

---

## 13.3 Chatbot tài chính đa chế độ

Chatbot FinTrack AI hoạt động theo 4 chế độ với system instruction khác nhau:

| Chế độ | System Instruction | Loại câu hỏi phù hợp |
|---|---|---|
| **Chat truy vấn** | Trợ lý tài chính cá nhân thông minh, phân tích chi tiêu và đưa ra lời khuyên | Hỏi về số liệu, xu hướng, tư vấn chung |
| **OCR Hóa đơn** | Trích xuất thông tin từ ảnh hóa đơn | Gửi ảnh, hỏi về nội dung hóa đơn |
| **Bất thường** | Phân tích lịch sử và tìm điểm bất thường, lãng phí | Yêu cầu kiểm tra, cảnh báo |
| **Kế hoạch** | Lập kế hoạch tiết kiệm theo thu nhập và mục tiêu | Đặt mục tiêu, hỏi cách tiết kiệm |

**Disclaimer bắt buộc** (đã có trong UI): *"FinTrack AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin quan trọng."*

---

## 13.4 Dự đoán xu hướng chi tiêu

**Mục đích**: Ước tính chi tiêu của người dùng trong thời gian tới dựa trên hành vi lịch sử.

**Phương pháp đề xuất**:
Sử dụng trung bình trượt (moving average) theo 3 tháng gần nhất cho mỗi danh mục, hoặc gửi dữ liệu lịch sử lên Gemini để AI dự báo xu hướng.

**Input cần thiết**: Ít nhất 3 tháng dữ liệu giao dịch.

**Output**: Dự báo chi tiêu theo danh mục cho tháng tới + mức độ tin cậy.

**Lưu ý**: Tính năng này hoạt động hiệu quả nhất khi người dùng có ≥ 30 giao dịch trong hệ thống.

---

## 13.5 Gợi ý tiết kiệm

**Mục đích**: Đề xuất hành động cụ thể để người dùng cải thiện thói quen tài chính.

**Quy trình hoạt động**:
1. Người dùng chọn chế độ "Kế hoạch" và mô tả mục tiêu (ví dụ: "Tôi muốn tiết kiệm 3 triệu mỗi tháng").
2. AI nhận context giao dịch hiện tại, phân tích tỷ lệ chi tiêu từng danh mục.
3. AI đề xuất danh mục nên cắt giảm, kèm con số cụ thể và lý do.

**Ví dụ output mẫu**:
*"Bạn đang chi 2.5 triệu/tháng cho Giải trí (chiếm 15% thu nhập). Nếu giảm xuống 1.5 triệu, bạn đã tiết kiệm được 1 triệu. Kết hợp với việc giảm chi phí cà phê từ 800k xuống 400k, bạn hoàn toàn đạt được mục tiêu 3 triệu/tháng."*

---

## 13.6 Phát hiện bất thường (Anomaly Detection)

**Mục đích**: Cảnh báo người dùng về các khoản chi bất thường so với thói quen trước đây.

**Quy trình hoạt động**:
1. Người dùng chọn chế độ "Bất thường" và gửi yêu cầu.
2. Hệ thống tổng hợp dữ liệu giao dịch theo danh mục và theo tháng.
3. AI so sánh chi tiêu hiện tại với trung bình 3 tháng trước, xác định các điểm lệch > 150% mức trung bình.
4. AI trình bày kết quả với giải thích rõ ràng và gợi ý hành động.

**Điều kiện phát hiện bất thường (đề xuất)**:
- Chi tiêu một danh mục tăng > 50% so với tháng trước.
- Có giao dịch đơn lẻ > 3 lần mức trung bình của danh mục đó.
- Số giao dịch trong một ngày > 3 lần mức trung bình hàng ngày.

---

## 13.7 OCR Hóa đơn

**Mục đích**: Giảm thời gian nhập liệu cho người dùng hay thanh toán bằng tiền mặt và nhận hóa đơn giấy.

**Cơ chế hoạt động**:
Sử dụng Gemini Vision model (`gemini-2.5-flash-image`) có khả năng nhận diện chữ trong ảnh. Người dùng upload ảnh hóa đơn → hệ thống convert sang base64 → gọi API với prompt trích xuất JSON có cấu trúc gồm: `tong_tien`, `danh_muc_goi_y`, `ghi_chu`, `ngay_thang`.

**Bước xác nhận bắt buộc**: Theo BR-007, kết quả OCR phải được người dùng review và xác nhận trước khi tạo giao dịch. Điều này đảm bảo độ chính xác của dữ liệu tài chính.

**Loại hóa đơn hỗ trợ**: Siêu thị, nhà hàng, cửa hàng tiện lợi, hóa đơn điện/nước. Hóa đơn viết tay hoặc chất lượng thấp có thể cho kết quả kém chính xác hơn.

**Các trường hợp lỗi cần xử lý**:
- Ảnh mờ, chụp góc nghiêng → AI trả về kết quả thiếu/sai.
- Hóa đơn không có tổng tiền rõ ràng.
- File không phải ảnh hóa đơn (ảnh selfie, phong cảnh).

---

# 14. Phân chia phạm vi theo giai đoạn

## Phase 1 – MVP (Core) | Dự kiến: 4–6 tuần

Mục tiêu của Phase 1 là hoàn thiện tất cả chức năng bắt buộc của đề bài, đảm bảo hệ thống hoạt động ổn định end-to-end.

**Chức năng bao gồm**:
- Hệ thống xác thực: Đăng ký, Đăng nhập, Đăng xuất.
- CRUD đầy đủ cho Giao dịch: Thêm, Sửa, Xoá, Xem danh sách.
- Tìm kiếm và lọc giao dịch (theo ghi chú, theo danh mục).
- Quản lý danh mục: Thêm, Sửa, Xoá (bao gồm 6 danh mục mặc định).
- Dashboard hiển thị Tổng Thu, Tổng Chi, Số Dư.
- Biểu đồ Area Chart thu chi theo tuần.
- Danh sách 5 giao dịch gần nhất trên Dashboard.
- Trang Thống Kê: Pie Chart, Bar Chart, bảng tổng hợp.
- Trang Cài Đặt: cập nhật hồ sơ cơ bản.
- Giao diện responsive cho mobile và desktop.

**Công nghệ**: React + TypeScript + Tailwind CSS + Recharts + React Router.

---

## Phase 2 – AI/NLP Integration | Dự kiến: 3–4 tuần sau Phase 1

Mục tiêu là tích hợp các tính năng AI tạo ra sự khác biệt và giá trị gia tăng của sản phẩm.

**Chức năng bao gồm**:
- Nhập liệu bằng ngôn ngữ tự nhiên (NLP Input) với Gemini API.
- Chatbot đa chế độ: Chat, OCR, Anomaly, Savings.
- OCR nhận diện và trích xuất dữ liệu từ ảnh hóa đơn.
- Phát hiện chi tiêu bất thường qua AI.
- Gợi ý kế hoạch tiết kiệm cá nhân hóa.
- Lịch sử hội thoại chatbot.
- Hệ thống thông báo cơ bản (notification bell).

**Công nghệ bổ sung**: Google Gemini API (`@google/genai`), xử lý base64 image.

---

## Phase 3 – Future Enhancements | Sau khi hoàn thành đồ án

Giai đoạn mở rộng để nâng cấp sản phẩm thành ứng dụng thương mại hoặc cho các học kỳ tiếp theo.

**Chức năng dự kiến**:
- Dark Mode hoàn chỉnh trên toàn bộ ứng dụng (UI đã chuẩn bị toggle).
- Thông báo nhắc nhở hàng ngày (push notification / email).
- Quản lý ngân sách (Budget) theo danh mục với cảnh báo vượt hạn mức.
- Dự báo chi tiêu tháng tới bằng AI.
- Xuất báo cáo PDF / Excel cá nhân hóa.
- Đồng bộ đa thiết bị qua cloud.
- Tích hợp đọc SMS/email thông báo ngân hàng để tự động nhập giao dịch.
- Native app iOS/Android (React Native hoặc Capacitor).
- Dashboard tùy chỉnh (kéo thả widget).

---

# 15. Acceptance Criteria

## AC-001: Đăng ký tài khoản

**Given** người dùng chưa có tài khoản và truy cập trang đăng ký,
**When** nhập email hợp lệ, mật khẩu ≥ 8 ký tự, xác nhận mật khẩu trùng khớp và nhấn "Đăng ký",
**Then**:
- [ ] Tài khoản mới được tạo trong hệ thống.
- [ ] Người dùng được chuyển vào Dashboard tự động (auto-login).
- [ ] 6 danh mục mặc định được khởi tạo cho tài khoản.
- [ ] Sidebar hiển thị tên người dùng.

**Negative cases**:
- [ ] Email đã tồn tại → hiển thị lỗi "Email này đã được sử dụng".
- [ ] Mật khẩu < 8 ký tự → hiển thị lỗi validation.
- [ ] Confirm password không khớp → hiển thị lỗi validation.

---

## AC-002: Đăng nhập

**Given** người dùng đã có tài khoản,
**When** nhập đúng email và mật khẩu, nhấn "Đăng nhập",
**Then**:
- [ ] Người dùng được chuyển vào Dashboard.
- [ ] Session được tạo và duy trì qua các lần refresh.
- [ ] Sidebar hiển thị tên và email người dùng.

**Negative cases**:
- [ ] Email hoặc mật khẩu sai → hiển thị lỗi "Email hoặc mật khẩu không đúng".

---

## AC-003: Thêm giao dịch

**Given** người dùng đã đăng nhập và đang ở trang Giao Dịch,
**When** nhấn "Thêm giao dịch", điền đầy đủ thông tin hợp lệ và nhấn "Lưu giao dịch",
**Then**:
- [ ] Modal đóng lại.
- [ ] Giao dịch mới xuất hiện ở đầu danh sách.
- [ ] Tổng Thu / Tổng Chi / Số Dư trên Dashboard được cập nhật ngay.
- [ ] Ngày mặc định là ngày hôm nay.

**Negative cases**:
- [ ] Số tiền = 0 hoặc bỏ trống → hiển thị lỗi validation, không lưu.
- [ ] Danh mục chưa chọn → hiển thị lỗi validation.

---

## AC-004: Sửa giao dịch

**Given** người dùng đang xem danh sách giao dịch,
**When** nhấn icon Edit trên một dòng, thay đổi số tiền và nhấn Lưu,
**Then**:
- [ ] Dữ liệu trong danh sách được cập nhật.
- [ ] Số dư và tổng quan được tính lại theo giá trị mới.
- [ ] Modal đóng lại.

---

## AC-005: Xoá giao dịch

**Given** người dùng đang xem danh sách giao dịch,
**When** nhấn icon Trash trên một dòng và xác nhận,
**Then**:
- [ ] Giao dịch biến mất khỏi danh sách.
- [ ] Số dư và tổng quan được tính lại.
- [ ] Hành động không thể hoàn tác (hoặc có toast thông báo trong 5 giây với nút Undo – giả định Phase 2).

---

## AC-006: Xem biểu đồ thống kê

**Given** người dùng đang ở trang Thống Kê và có ít nhất 1 giao dịch chi tiêu,
**When** trang load xong,
**Then**:
- [ ] Pie Chart hiển thị đúng tỷ lệ chi tiêu theo từng danh mục có dữ liệu.
- [ ] Bar Chart hiển thị dữ liệu 6 tháng gần nhất.
- [ ] Bảng tổng hợp hiển thị đúng số giao dịch, tổng tiền và tỷ lệ % cho mỗi danh mục.
- [ ] Tổng tỷ lệ % trong bảng bằng 100%.

---

## AC-007: Xem số dư

**Given** người dùng có ít nhất 1 giao dịch trong hệ thống,
**When** truy cập Dashboard,
**Then**:
- [ ] Card "Số Dư" hiển thị đúng giá trị = Tổng Thu − Tổng Chi.
- [ ] Nếu Số Dư âm, hiển thị màu đỏ cảnh báo (khuyến nghị).
- [ ] Số tiền được format đúng định dạng VNĐ (có dấu phân cách nghìn).

---

## AC-008: Nhập liệu bằng NLP

**Given** người dùng nhấn "Nhập nhanh (NLP)" và nhập câu tiếng Việt hợp lệ,
**When** nhấn "Phân tích và nhập liệu" và API trả về thành công,
**Then**:
- [ ] Modal NLP đóng lại.
- [ ] Modal form giao dịch mở ra với dữ liệu đã điền: số tiền, loại (thu/chi), ghi chú.
- [ ] Người dùng có thể chỉnh sửa dữ liệu trước khi lưu.
- [ ] Giao dịch chỉ được lưu khi người dùng nhấn "Lưu giao dịch" trong modal form.

**Negative case**:
- [ ] Nếu Gemini API không trả về kết quả hợp lệ → hiển thị thông báo lỗi thân thiện.

---

## AC-009: Truy vấn NLP (Chatbot)

**Given** người dùng đang ở trang AI Trợ Lý, chế độ "Chat truy vấn",
**When** nhập câu hỏi về tài chính và nhấn Send,
**Then**:
- [ ] Tin nhắn của người dùng xuất hiện trong chat bubble (phải, màu tối).
- [ ] Indicator loading (3 chấm nhấp nháy) hiển thị trong khi chờ.
- [ ] Phản hồi AI xuất hiện sau ≤ 8 giây.
- [ ] Tin nhắn AI hiển thị trong bubble trái với icon Bot.
- [ ] Cuộc hội thoại tích lũy theo chiều dọc, scroll xuống tự động.

---

## AC-010: OCR Hóa đơn

**Given** người dùng upload ảnh hóa đơn rõ nét qua icon Paperclip,
**When** API OCR xử lý xong,
**Then**:
- [ ] Kết quả trích xuất hiển thị trong chat dưới dạng text có cấu trúc (tổng tiền, danh mục, ngày).
- [ ] Người dùng không bị tự động tạo giao dịch.
- [ ] Kết quả có thể được copy/xem để người dùng tự quyết định lưu.

---

## AC-011: Gợi ý AI (Savings/Anomaly)

**Given** người dùng chọn chế độ "Kế hoạch" hoặc "Bất thường" và gửi yêu cầu,
**When** AI phản hồi,
**Then**:
- [ ] Phản hồi có nội dung liên quan đến tài chính cá nhân.
- [ ] Phản hồi có tính gợi ý, hướng dẫn (không phải chỉ nêu vấn đề).
- [ ] Disclaimer "FinTrack AI có thể mắc lỗi" hiển thị dưới composer.
- [ ] Hệ thống không tự động thực hiện bất kỳ thay đổi dữ liệu nào.

---

# 16. Rủi ro và lưu ý triển khai

## 16.1 Bảng phân tích rủi ro

| ID | Rủi ro | Mức độ | Khả năng xảy ra | Hướng giảm thiểu |
|---|---|---|---|---|
| R-001 | NLP hiểu sai câu lệnh tiếng Việt | Cao | Trung bình | Luôn có bước review + confirm trước khi lưu; hiển thị dữ liệu parsed rõ ràng để người dùng kiểm tra |
| R-002 | OCR nhận diện sai số tiền | Cao | Cao | Bắt buộc xác nhận trước khi lưu (BR-007); hướng dẫn người dùng chụp ảnh đúng góc, đủ sáng |
| R-003 | Dự đoán AI không chính xác | Trung bình | Cao | Thêm disclaimer rõ ràng; đây là gợi ý tham khảo, không phải quyết định tự động |
| R-004 | Dữ liệu tài chính bị lộ | Rất cao | Thấp | HTTPS bắt buộc; isolation theo user; không log dữ liệu nhạy cảm; API key ở server-side |
| R-005 | Gemini API rate limit / downtime | Trung bình | Trung bình | Xử lý gracefully khi API lỗi; hiển thị thông báo thân thiện; retry logic |
| R-006 | Người dùng mất niềm tin vì gợi ý sai | Cao | Trung bình | Disclaimer rõ; framing là "gợi ý tham khảo"; không dùng từ ngữ tuyệt đối ("chắc chắn", "nhất định") |
| R-007 | Dữ liệu ít → AI khó phân tích | Trung bình | Cao (giai đoạn đầu) | Yêu cầu tối thiểu ≥ 10 GD để kích hoạt AI analysis; hiển thị hướng dẫn cho người dùng mới |
| R-008 | Phụ thuộc API Key Gemini | Cao | Thấp | Lưu API key ở .env; hỗ trợ cấu hình qua Settings (cho demo đồ án); không hardcode trong code |
| R-009 | Ảnh hóa đơn chứa thông tin nhạy cảm | Trung bình | Trung bình | Không lưu ảnh gốc; chỉ xử lý in-memory; xóa ngay sau khi OCR xong |
| R-010 | UI không phù hợp màn hình nhỏ | Thấp | Trung bình | Test responsive trên nhiều kích thước; sidebar collapse trên mobile |

---

# 17. Giả định và điểm cần xác nhận

Phần này liệt kê các điểm mà PRD này đã phải giả định do thiếu thông tin từ mô tả ý tưởng ban đầu hoặc do code UI chưa implement đầy đủ.

| ID | Giả định | Lý do giả định | Cần xác nhận với |
|---|---|---|---|
| A-001 | Hệ thống xác thực (Auth) chưa có trong code UI hiện tại. Đây là **giả định cần triển khai thêm** trong Phase 1. | Code UI dùng dữ liệu mock, không có login screen | Dev team |
| A-002 | Dữ liệu hiện tại lưu trong React state (memory), chưa có backend/database. Cần tích hợp backend (Node.js / Supabase / Firebase) để persist dữ liệu. | Dữ liệu mất khi refresh trang | Dev team |
| A-003 | Tính năng chỉnh sửa giao dịch (Edit button) trong UI đã có icon nhưng chưa có handler logic. **Giả định** là sẽ implement tương tự flow thêm mới với form pre-filled. | Edit icon tồn tại nhưng onClick chưa được implement | Dev team |
| A-004 | Dialog xác nhận trước khi xóa giao dịch chưa có trong code hiện tại. **Giả định** sẽ cần thêm để tránh xóa nhầm (theo best practice UX). | Trash button gọi trực tiếp filter, không hỏi | Design/Dev |
| A-005 | Tính năng thêm/sửa danh mục qua form chưa được implement (chỉ có button "Thêm danh mục" và icon Edit/Trash). **Giả định** cần implement modal tương tự giao dịch. | UI có button nhưng không có handler | Dev team |
| A-006 | Mapping từ `suggestedCategory` (tiếng Anh từ Gemini) sang `categoryId` (danh mục tiếng Việt của user) chưa được implement. Code hiện tại hardcode `categoryId: '1'`. | Xem `handleNlpSubmit` trong Transactions.tsx | Dev team |
| A-007 | Chat history (sidebar trái) hiện tại là mock data (3 item giả). **Giả định** cần backend để lưu và load lịch sử thực. | AiAssistant.tsx render [1,2,3].map cố định | Dev team |
| A-008 | Dark Mode toggle có trong Settings nhưng chỉ thay đổi local state, chưa apply lên toàn bộ app. **Giả định** cần implement Tailwind dark mode class hoặc CSS variables. | Settings.tsx chỉ setTheme local | Dev team |
| A-009 | Tìm kiếm giao dịch hiện tại chỉ theo `note` (ghi chú). **Giả định** nên mở rộng tìm kiếm theo cả tên danh mục và số tiền trong Phase 1. | Transactions.tsx filter: `t.note.toLowerCase().includes(filter)` | Product/Dev |
| A-010 | Hóa đơn OCR không được lưu lại dưới dạng bản ghi transaction tự động. Người dùng phải tự tạo transaction sau khi xem kết quả OCR trong chat. **Giả định** Phase 2 nên thêm nút "Lưu thành giao dịch" trong chat bubble OCR. | ocrInvoice chỉ trả text, không tạo transaction | Design/Dev |
| A-011 | Model Gemini được dùng trong code là `gemini-3-flash-preview` – đây là model preview. **Giả định** khi release sẽ cần cập nhật sang model stable tương ứng. | geminiService.ts | Dev team |
| A-012 | Không rõ giới hạn kích thước ảnh OCR. **Giả định** tối đa 5MB và chỉ hỗ trợ jpg/png/webp theo `accept="image/*"` trong file input. | AiAssistant.tsx: `accept="image/*"` | Dev/PM |

---

# 18. Kết luận

## 18.1 Tóm tắt sản phẩm

FinTrack AI là một ứng dụng quản lý tài chính cá nhân thế hệ mới, được xây dựng trên nền tảng công nghệ hiện đại (React + TypeScript + Tailwind CSS) kết hợp với sức mạnh của Google Gemini AI. Sản phẩm không chỉ đáp ứng đủ các yêu cầu cơ bản của một đồ án quản lý thu chi (CRUD giao dịch, phân loại danh mục, biểu đồ thống kê, tính số dư) mà còn tạo ra điểm khác biệt rõ rệt thông qua 4 tính năng AI quan trọng: nhập liệu NLP, chatbot đa chế độ, OCR hóa đơn và phát hiện bất thường.

## 18.2 Định hướng phát triển

Lộ trình phát triển được chia thành 3 giai đoạn rõ ràng:

**Phase 1** tập trung hoàn thiện tất cả chức năng core MVP, đảm bảo hệ thống hoạt động đúng và dữ liệu được persist bền vững thông qua backend và database.

**Phase 2** tích hợp đầy đủ các tính năng AI/NLP – đây là phần tạo ra giá trị học thuật và thực tiễn cao nhất của sản phẩm.

**Phase 3** hướng đến mở rộng thành sản phẩm thương mại với các tính năng nâng cao hơn và đa nền tảng.

## 18.3 Lời khuyên triển khai

Nhóm phát triển nên ưu tiên giải quyết trước các điểm giả định quan trọng: (1) lựa chọn và tích hợp backend/database để dữ liệu không mất khi refresh; (2) implement màn hình đăng ký/đăng nhập; (3) hoàn thiện mapping NLP category; (4) implement bước xác nhận xóa giao dịch. Bốn điểm này là điều kiện tiên quyết để sản phẩm vận hành đúng nghĩa.

Về phần AI/NLP, nhóm nên test kỹ với nhiều mẫu câu tiếng Việt thực tế, bao gồm cả các câu viết tắt, từ địa phương và đơn vị tiền tệ không chuẩn. Độ chính xác của NLP là yếu tố quyết định trải nghiệm người dùng và tính thuyết phục của sản phẩm.

---

*Tài liệu này được soạn thảo dựa trên phân tích source code UI (React/TypeScript) của dự án FinTrack AI và ý tưởng sản phẩm được cung cấp. Mọi điểm giả định đã được đánh dấu rõ ràng trong Mục 17. PRD này sẵn sàng để review và làm tài liệu bàn giao cho team Design và Development.*

---

**Phiên bản**: 1.0 | **Ngày**: 2026-03-21 | **Trạng thái**: Draft – Pending Review
