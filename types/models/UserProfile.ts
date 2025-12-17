/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences?: UserPreferences;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  industryInterests?: string[];
  preferredIdeaTypes?: IdeaType[];
  notificationSettings?: NotificationSettings;
}

/**
 * Types of business ideas a user might be interested in
 */
export enum IdeaType {
  PRODUCT = 'product',
  SERVICE = 'service',
  PLATFORM = 'platform',
  MARKETPLACE = 'marketplace',
  SAAS = 'saas',
  ECOMMERCE = 'ecommerce',
  CONSULTING = 'consulting',
  CONTENT = 'content',
  OTHER = 'other',
}

/**
 * Notification preferences
 */
export interface NotificationSettings {
  emailNotifications: boolean;
  ideaUpdates: boolean;
  weeklyDigest: boolean;
}

