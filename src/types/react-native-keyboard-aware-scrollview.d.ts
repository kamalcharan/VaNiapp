declare module 'react-native-keyboard-aware-scrollview' {
  import { Component } from 'react';
  import { ScrollViewProps } from 'react-native';

  interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    extraHeight?: number;
    extraScrollHeight?: number;
  }

  export class KeyboardAwareScrollView extends Component<KeyboardAwareScrollViewProps> {}
}
