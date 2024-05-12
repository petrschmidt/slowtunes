import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const NoSSRWrapper = ({ children }: { children?: ReactNode }) => (
  <React.Fragment>{children}</React.Fragment>
);
export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false,
});
