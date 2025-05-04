export type MediaType = 'video' | 'only-audio' | 'none';

export interface StreamObject {
    stream?: MediaStream;
    type: MediaType;
}
