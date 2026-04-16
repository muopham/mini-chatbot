export function validateMessageContent(
  content: string | undefined,
  imgUrl: string | undefined,
): void {
  const hasContent = content && content.trim().length > 0;
  const hasImage = imgUrl && imgUrl.length > 0;

  if (!hasContent && !hasImage) {
    throw new Error('The message must contain text or an image.');
  }
}

/**
 * Xác định loại message để lưu vào lastMessage cache
 */
export function getMessageType(
  content: string | undefined,
  imgUrl: string | undefined,
): 'text' | 'image' | 'mixed' {
  const hasContent = content && content.trim().length > 0;
  const hasImage = imgUrl && imgUrl.length > 0;

  if (hasContent && hasImage) return 'mixed';
  if (hasImage) return 'image';
  return 'text';
}

/**
 * Tạo preview text cho lastMessage
 * - Text: lấy 100 ký tự đầu
 * - Image: trả về "[Hình ảnh]"
 * - Mixed: trả về content trước
 */
export function buildMessagePreview(
  content: string | undefined,
  imgUrl: string | undefined,
): string {
  if (!content && imgUrl) return '[Hình ảnh]';
  if (content && imgUrl) return content.substring(0, 100);
  if (content) return content.substring(0, 100);
  return '';
}

/**
 * Build cursor query từ cursor string (ISO date string)
 * Dùng để query messages trước 1 thời điểm cụ thể
 */
export function buildCursorQuery(cursor: string | undefined): object {
  if (!cursor) return {};

  const cursorDate = new Date(cursor);
  if (isNaN(cursorDate.getTime())) {
    throw new Error('Cursor không hợp lệ, phải là ISO date string');
  }

  return { createdAt: { $lt: cursorDate } };
}
