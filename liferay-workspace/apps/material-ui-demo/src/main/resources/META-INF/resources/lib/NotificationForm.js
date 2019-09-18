import React, { useState, useCallback } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';

import configurator from './configurator';

const useStyles = makeStyles(theme => ({
    body: {
        marginBottom: theme.spacing(2),
    },
}));

export function NotificationForm({ users }) {
    const [sent, setSent] = useState(false);
    const [userId, setUser] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const classes = useStyles();

    const onSelectUser = useCallback(event => setUser(event.target.value), []);
    const onSubjectChange = useCallback(event => setSubject(event.target.value), []);
    const onBodyChange = useCallback(event => setBody(event.target.value), []);
    const onSubmit = event => {
        event.preventDefault();
        const config = configurator.getConfig();
        const url = new URL(config.notificationServiceUrl, window.location.href);
        const portletNamespace = config.portletNamespace;
        url.searchParams.append(`${portletNamespace}user`, userId);
        url.searchParams.append(`${portletNamespace}subject`, subject);
        url.searchParams.append(`${portletNamespace}body`, body);
        fetch(url).then(() => setSent(true), e => console.error(e));
    };
    const userOptions = !users ?
            [<MenuItem key="">Загрузка...</MenuItem>] :
            users.map(user =>
                    <MenuItem key={user.userId} value={user.userId}>{user.firstName} {user.lastName}</MenuItem>);

    return (
        <form onSubmit={onSubmit}>
            <FormGroup>
                <FormControl required error={!userId}>
                    <InputLabel>Пользователь</InputLabel>
                    <Select value={userId} onChange={onSelectUser}>
                        {userOptions}
                    </Select>
                </FormControl>
            </FormGroup>
            <TextField
                label="Тема"
                value={subject}
                fullWidth
                required
                error={!subject}
                onChange={onSubjectChange}
            />
            <TextField
                label="Сообщение"
                multiline
                rows="4"
                value={body}
                fullWidth
                onChange={onBodyChange}
                className={classes.body}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!users || !userId || !subject}>
                Primary
            </Button>
            {sent ? <FormHelperText>Уведомление отправлено</FormHelperText> : null}
        </form>
    );
}
