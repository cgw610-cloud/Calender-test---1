export interface TeamMember {
  id: string;
  name: string;
  role: string;
  color: string; // Pastel color code or tailwind color class
  avatarEmoji: string;
}

export interface ScheduleCategory {
  id: string;
  name: string;
  color: string; // Background color
  textColor: string;
  borderColor: string;
  icon: string; // Emoji or icon name
  isOff?: boolean; // Whether this counts as day off / leave
  isNight?: boolean; // Whether this is night shift
}

export interface ScheduleEntry {
  id: string;
  date: string; // YYYY-MM-DD
  memberId: string;
  categoryId: string;
  note?: string;
}

export interface RandomShiftSettings {
  startDate: string;
  endDate: string;
  selectedMemberIds: string[];
  selectedCategoryIds: string[]; // Categories to randomly assign (e.g., Morning, Evening, Night)
  excludeWeekends: boolean;
  maxPerDay?: number;
}
