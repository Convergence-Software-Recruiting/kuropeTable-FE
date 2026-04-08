import axios from 'axios';
import { installMockApi } from '@/lib/mocks/mockApi';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const apiClient = axios.create({
  baseURL: BASE,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 백엔드 배포 전까지는 모든 API를 목데이터로 응답한다.
installMockApi(apiClient);
