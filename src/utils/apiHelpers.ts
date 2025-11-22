import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './constants';
import { User } from '@/types';

/**
 * Helper to handle JSON Server array responses
 * JSON Server returns arrays even for single item queries
 */
export const getFirstItem = <T>(data: T | T[]): T | null => {
  if (Array.isArray(data)) {
    return data.length > 0 ? data[0] : null;
  }
  return data;
};

/**
 * Helper to handle JSON Server array responses - get all items
 */
export const getArray = <T>(data: T | T[]): T[] => {
  if (Array.isArray(data)) {
    return data;
  }
  return data ? [data] : [];
};

/**
 * Login user using JSON Server query
 */
export const loginUser = async (email: string, password: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.USERS.BY_EMAIL_PASSWORD(email, password)
  );
  const users = getArray(response.data);
  return getFirstItem(users);
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_EMAIL(email));
  const users = getArray(response.data);
  return getFirstItem(users);
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.USERS.BY_ROLE(role));
  return getArray(response.data);
};

/**
 * Get patient profile by userId
 */
export const getPatientProfileByUser = async (userId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PATIENT_PROFILES.BY_USER(userId)
  );
  const profiles = getArray(response.data);
  return getFirstItem(profiles);
};

/**
 * Get goals by userId
 */
export const getGoalsByUser = async (userId: string) => {
  const response = await axiosClient.get(API_ENDPOINTS.GOALS.BY_USER(userId));
  return getArray(response.data);
};

/**
 * Get reminders by userId
 */
export const getRemindersByUser = async (userId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.REMINDERS.BY_USER(userId)
  );
  return getArray(response.data);
};

/**
 * Get provider assignments by providerId
 */
export const getAssignmentsByProvider = async (providerId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PROVIDER(providerId)
  );
  return getArray(response.data);
};

/**
 * Get provider assignments by patientId
 */
export const getAssignmentsByPatient = async (patientId: string) => {
  const response = await axiosClient.get(
    API_ENDPOINTS.PROVIDER_ASSIGNMENTS.BY_PATIENT(patientId)
  );
  return getArray(response.data);
};

/**
 * Get patient users by fetching from users endpoint with role filter
 */
export const getPatientUsers = async (): Promise<User[]> => {
  return getUsersByRole('patient');
};

/**
 * Get provider users by fetching from users endpoint with role filter
 */
export const getProviderUsers = async (): Promise<User[]> => {
  return getUsersByRole('provider');
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const response = await axiosClient.get(API_ENDPOINTS.USERS.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

/**
 * Get multiple users by IDs
 */
export const getUsersByIds = async (ids: string[]): Promise<User[]> => {
  try {
    const promises = ids.map((id) => getUserById(id));
    const users = await Promise.all(promises);
    return users.filter((u): u is User => u !== null);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
};
