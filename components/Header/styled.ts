import styled from "styled-components";

export const StyledHeader = styled.header`
  .${({ theme }) => theme.prefix} {
    &-btn {
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
