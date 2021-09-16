import { NavigationActions } from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName: string, params?: Record<string, unknown>) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    }),
  );
}

function goBack() {
  //navigator._navigation.goBack();
  navigator.dispatch(NavigationActions.back());
}

// add other navigation functions that you need and export them

export default {
  goBack,
  navigate,
  setTopLevelNavigator,
};
