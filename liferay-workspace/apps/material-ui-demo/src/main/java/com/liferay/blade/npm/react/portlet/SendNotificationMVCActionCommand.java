package com.liferay.blade.npm.react.portlet;

import com.liferay.blade.npm.react.portlet.utils.PortletKeys;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.model.UserNotificationDeliveryConstants;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCActionCommand;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.service.UserNotificationEventLocalService;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletException;

@Component(
        immediate = true,
        property = {
                "javax.portlet.name=" + PortletKeys.PORTLET_NAME,
                "mvc.command.name=/send/notification"
        },
        service = MVCActionCommand.class
)
public class SendNotificationMVCActionCommand implements MVCActionCommand {

    Log log = LogFactoryUtil.getLog(SendNotificationMVCActionCommand.class);

    @Reference
    private UserLocalService userLocalService;

    @Reference
    private UserNotificationEventLocalService userNotificationEventLocalService;

    @Override
    public boolean processAction(
            ActionRequest actionRequest, ActionResponse actionResponse)
            throws PortletException {

        ThemeDisplay themeDisplay = (ThemeDisplay) actionRequest.getAttribute(WebKeys.THEME_DISPLAY);

        long userId = ParamUtil.getLong(actionRequest, "user", 0l);
        String subject = ParamUtil.getString(actionRequest, "subject", "");
        String body = ParamUtil.getString(actionRequest, "body", "");

        log.info("userId: " + userId);
        log.info("subject: " + subject);
        log.info("body: " + body);

        try {
            User user = userLocalService.getUser(userId);
            User currentUser = themeDisplay.getUser();

            JSONObject extraDataJSONObject = JSONFactoryUtil.createJSONObject();
            extraDataJSONObject.put(PortletKeys.NOTIFICATION_TEXT, body);
            extraDataJSONObject.put(PortletKeys.NOTIFICATION_TITILE, subject);
            extraDataJSONObject.put(PortletKeys.NOTIFICATION_SENDER, currentUser.getFullName());
            log.info("send notification: " + extraDataJSONObject.toString());
            userNotificationEventLocalService.sendUserNotificationEvents(user.getUserId(), PortletKeys.PORTLET_NAME,
                    UserNotificationDeliveryConstants.TYPE_WEBSITE, extraDataJSONObject);
        } catch (Exception e) {
            log.error(e);
            return false;
        }
        return true;
    }
}
