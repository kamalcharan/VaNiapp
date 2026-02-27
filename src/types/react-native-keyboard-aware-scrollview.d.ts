declare module 'react-native-keyboard-aware-scroll-view' {
  import { Component } from 'react';
  import { ScrollViewProps } from 'react-native';

  interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    extraHeight?: number;
    extraScrollHeight?: number;
    enableOnAndroid?: boolean;
    enableAutomaticScroll?: boolean;
    keyboardOpeningTime?: number;
  }

  export class KeyboardAwareScrollView extends Component<KeyboardAwareScrollViewProps> {}
}
