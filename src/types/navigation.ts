/* eslint-disable @typescript-eslint/no-empty-object-type */
export type RootStackParamList = {
  Home: undefined;
  VideoDetails: { videoId: string };
  Channel: { channelId: string };
  Search: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
