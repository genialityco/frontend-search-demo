/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types.ts

export interface Activity {
    text: any;
    matching_segments: any;
    _id: string;
    name: string;
    datetime_start: string;
    datetime_end: string;
    event_id: string;
    date_start_zoom: string;
    date_end_zoom: string;
    description: string | null;
    short_description: string | null;
    video: string;
    is_info_only: boolean;
    selected_document: string[];
    type_id: string | null;
    transcription: string | null;
  }
  