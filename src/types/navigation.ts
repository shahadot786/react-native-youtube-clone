/* eslint-disable @typescript-eslint/no-empty-object-type */
export type RootStackParamList = {
  Home: undefined;
  VideoDetails: {
    videoId: string;
    channelId: string;
    playlistId?: string;
    playlistIndex?: number;
  };
  Channel: { channelId: string };
  Search: undefined;
  PlaylistDetails: { playlistId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
