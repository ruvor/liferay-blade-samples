import React, { useState } from 'react';

import { NotificationForm } from './NotificationForm';

export function Notifications() {
    const [users, setUsers] = useState();
    if (!users) {
        Liferay.Service('/user/get-company-users', {
            companyId: Liferay.ThemeDisplay.getCompanyId(),
            start: -1,
            end: -1,
        },
        users => setUsers(users));
    }

    return (
        <NotificationForm users={users} />
    );
}
