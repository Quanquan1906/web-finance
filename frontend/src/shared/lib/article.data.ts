export const users = [
  {
    id: 'user-a82',
    name: 'Alice Admin',
    role: 'admin'
  },
  {
    id: 'user-b93',
    name: 'Bob Editor',
    role: 'editor'
  },
  {
    id: 'user-c04',
    name: 'Charlie Viewer',
    role: 'viewer'
  }
];

export const articles = [
  {
    id: 'art-101',
    title: 'Giới thiệu về TypeScript',
    authorId: 'user-b93',
    contentPreview: 'TypeScript mở rộng JavaScript bằng cách thêm các kiểu tĩnh...',
    createdAt: '2025-11-20T10:00:00Z'
  },
  {
    id: 'art-102',
    title: 'Bảo mật dựa trên vai trò',
    authorId: 'user-a82',
    contentPreview:
      'Việc kiểm soát truy cập dựa trên vai trò (RBAC) là một phương pháp quan trọng...',
    createdAt: '2025-11-21T14:30:00Z'
  },
  {
    id: 'art-103',
    title: 'Các tính năng mới của ECMAScript 2024',
    authorId: 'user-c04',
    contentPreview:
      'Phiên bản mới nhất của tiêu chuẩn JavaScript mang đến những cải tiến thú vị...',
    createdAt: '2025-11-22T09:15:00Z'
  }
];
