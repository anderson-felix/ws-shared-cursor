import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 3rem;
  display: flex;
  margin: auto;
  flex-direction: column;
  row-gap: 3rem;
  background-color: ${props => props.theme.colors.background};
  overflow: hidden;
`;
