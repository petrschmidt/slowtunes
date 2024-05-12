import { Button, ButtonProps } from '@/components/ui/shadcn/button';
import { LoadingSpinner } from '@/components/ui/loader-spinner';

export type ButtonWithLoaderProps = ButtonProps & {
  loading?: boolean;
};

export const ButtonWithLoader = ({
  loading,
  children,
  ...props
}: ButtonWithLoaderProps) => (
  <Button {...props}>
    {children}
    {loading && <LoadingSpinner className='ml-2' />}
  </Button>
);
