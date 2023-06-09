import styled from 'styled-components'

// This is the styling for the Landing page

// componenets from styled-components
const Wrapper = styled.main`
  nav {
    width: var(--fluid-width); // allows the width to be flexible based on the container size
    max-width: var(--max-width); // specifies the maximum width of the element
    margin: 0 auto; // centers the element horizontally by setting the left and right margins to auto
    height: var(--nav-height); // specifies the height of the element
    display: flex; 
    align-items: center; // centers the contents of the element vertically
  }
  // add . if targeting a className
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid; // for the two-column layout
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    // target the <span> in <h1>
    span {
      // css variables
      // --property-name: property-value;
      color: var(--primary-500);
      
    }
  }
  p {
    color: var(--grey-600);
  }
  // don't want to display the image when the screen is narrow
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr; // two columns same width
      column-gap: 3rem;
    }
    // display the image when screen is wide
    .main-img {
      display: block;
    }
  }
`
export default Wrapper
