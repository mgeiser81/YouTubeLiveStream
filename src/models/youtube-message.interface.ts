export interface YoutubeMessage {
    id: string;
    type: string;
    chatId: string;
    authorChannelId: string;
    authorName: string;
    authorImage: string;
    isOwner: boolean;
    text: string;
    dateAdded: number;
}