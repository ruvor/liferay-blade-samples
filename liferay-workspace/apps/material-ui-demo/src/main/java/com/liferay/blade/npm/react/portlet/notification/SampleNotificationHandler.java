package com.liferay.blade.npm.react.portlet.notification;

import com.liferay.blade.npm.react.portlet.utils.PortletKeys;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.model.UserNotificationEvent;
import com.liferay.portal.kernel.notifications.BaseUserNotificationHandler;
import com.liferay.portal.kernel.notifications.UserNotificationHandler;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.StringUtil;
import org.osgi.service.component.annotations.Component;

@Component(
        immediate = true,
        service = UserNotificationHandler.class
)
public class SampleNotificationHandler extends BaseUserNotificationHandler {

    public SampleNotificationHandler() {
        setPortletId(PortletKeys.PORTLET_NAME);
    }

    @Override
    protected String getBody(UserNotificationEvent userNotificationEvent, ServiceContext serviceContext)
            throws Exception {
        JSONObject jsonObject = JSONFactoryUtil.createJSONObject(userNotificationEvent.getPayload());
        String title = jsonObject.getString(PortletKeys.NOTIFICATION_TITILE);
        String text = jsonObject.getString(PortletKeys.NOTIFICATION_TEXT);
        String sender = jsonObject.getString(PortletKeys.NOTIFICATION_SENDER);
        return StringUtil.replace(getBodyTemplate(),
                new String[]{"[$TITLE$]","[$SENDER$]","[$BODY_TEXT$]"},
                new String[]{title, text, sender});
    }

    protected String getBodyTemplate() {
        StringBuilder sb = new StringBuilder();
        sb.append("<div class=\"title\">Tittle::[$TITLE$]</div>");
        sb.append("<div class=\"body\">Sender::[$SENDER$] <br/>Notification::[$BODY_TEXT$]</div>");
        return sb.toString();
    }
}
