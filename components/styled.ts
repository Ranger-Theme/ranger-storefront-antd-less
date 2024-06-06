import styled from "styled-components";

export const StyledContainer = styled.div<{
  isLogin: boolean;
  screenWidth: any;
}>`
  @media (max-width: ${({ theme }) => theme.breakPoint.m}px) {
    min-width: ${(props) => (props.isLogin ? "12rem" : "100%")};

    .${({ theme }) => theme.namespace} {
      &-dropdown {
        inset: 35px auto auto 0 !important;
        min-width: ${(props) => props.screenWidth}px !important;
      }
    }
  }
`;

export const StyledOverlay = styled.div<{
  isLogin: boolean;
}>`
  min-width: ${(props) => (props.isLogin ? "11rem" : "20rem")};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);

  @media (max-width: 1024px) {
    min-width: 320px;

    .forgot {
      display: block;
      margin-bottom: 20px;
      text-align: right;
    }

    .${({ theme }) => theme.namespace} {
      &-btn {
        height: 45px !important;
        font-size: 14px !important;
        border-radius: 5px !important;
      }
    }
  }
`;
