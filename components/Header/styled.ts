import styled from "styled-components";

export const StyledHeader = styled.header<{
  padding: number;
}>`
  padding: ${(props) => `${props.padding}px`};

  .${({ theme }) => theme.prefix} {
    &-btn {
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoint.m}px) {
    .${({ theme }) => theme.prefix} {
      &-btn {
        text-transform: lowercase;
      }
    }
  }
`;
