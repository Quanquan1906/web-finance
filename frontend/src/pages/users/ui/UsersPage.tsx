import { SuspenseLoader } from '@/shared/ui/suspense-loader';
import { UserList } from '@/widgets/user-list';
import { CreateUserButton } from '@/features/users/create-user';

export const UsersPage: React.FC = () => (
  <div className="container py-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <CreateUserButton />
    </div>
    <SuspenseLoader>
      <UserList />
    </SuspenseLoader>
  </div>
);