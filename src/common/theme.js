// some default colors used in the application

export const theme = {
  FONT_ONE: 'Roboto-Bold',
  FONT_SIZE_BUTTONS: 18,
  BUTTON_BLUE: '#47668B',
  BUTTON_SKY: 'rgba(57,137,233,1)',
  BUTTON_YELLOW: '#F9C667',
  BUTTON_PRIMARY: '#1E81D3',
  BUTTON_TEXT: '#fff',
};

export const colors = {
  TRANSPARENT: 'transparent',
  WHITE: '#fff',
  BLACK: '#000',
  RED: 'red',
  SKY: '#1E81D3',
  DARK: '#070807',
  ICONC: '#ccc',

  GREY: {
    default: '#00b546',
    primary: '#f5f1f1',
    secondary: '#9b9b9b',
    border: '#d6d6d6',
    btnPrimary: '#666666',
    btnSecondary: '#ababab',
    iconPrimary: '#c8c8c8',
    iconSecondary: '#3d3d3d',
    background: 'rgba(22,22,22,0.8)',
    Deep_Nobel: '#9f9f9f',
  },
  BLUE: {
    default: 'blue',
    primary: 'rgba(111, 202, 186, 1)',
    secondary: '#007aff',
    light: '#8ec4e6',
    dark: '#111b1e',
    sky: '#4a90e2',
  },
  YELLOW: {
    primary: '#fda33b',
    secondary: '#ffe446',
    light: '#dbd6a0',
  },
  GREEN: {
    default: 'green',
    background: '#2e342d',
    light: '#32db64',
  },
};

export const pagePaddingLeft = 25;

export const styles = {
  inputContainerStyle: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.GREY.border,
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 0,
    padding: 0,
    width: '100%',
    marginBottom: 15,
  },
  containerStyle: {
    display: 'flex',
    margin: 0,
    // backgroundColor: "aqua",
    padding: 0,
    paddingRight: 0,
    paddingLeft: 0,
    width: '100%',
  },
  inputStyle: {
    color: colors.DARK,
    fontSize: 13,
    // height:32,
    // borderWidth: 1,
    padding: 10,
    margin: 0,
    width: '100%',
  },
  errorStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 0,
  },

};
