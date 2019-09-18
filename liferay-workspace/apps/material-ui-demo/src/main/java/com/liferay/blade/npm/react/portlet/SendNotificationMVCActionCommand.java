package com.liferay.blade.npm.react.portlet;

import com.liferay.blade.npm.react.portlet.utils.PortletKeys;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCActionCommand;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.social.kernel.service.SocialActivityLocalService;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.PortletException;

@Component(
        immediate = true,
        property = {
                "javax.portlet.name=" + PortletKeys.PORTLET_NAME,
                "mvc.command.name=notification"
        },
        service = MVCActionCommand.class
)
public class SendNotificationMVCActionCommand implements MVCActionCommand {

    Log log = LogFactoryUtil.getLog(SendNotificationMVCActionCommand.class);

    @Reference
    private SocialActivityLocalService socialActivityLocalService;

    @Reference
    private UserLocalService userLocalService;

    @Override
    public boolean processAction(
            ActionRequest actionRequest, ActionResponse actionResponse)
            throws PortletException {

        long userId = ParamUtil.getLong(actionRequest, "user", 0l);
        String subject = ParamUtil.getString(actionRequest, "subject", "");
        String body = ParamUtil.getString(actionRequest, "body", "");

        log.info("userId: " + userId);
        log.info("subject: " + subject);
        log.info("body: " + body);

        try {
            User user = userLocalService.getUser(userId);

            JSONObject extraDataJSONObject = JSONFactoryUtil.createJSONObject();
            extraDataJSONObject.put("notificationText", body);
            extraDataJSONObject.put("notificationSubject", subject);
            extraDataJSONObject.put("notificationUrl", "");
            socialActivityLocalService.addActivity(user.getUserId(), user.getGroupId(),
                    SendNotificationMVCActionCommand.class.getName(), user.getUserId(), 1,
                    extraDataJSONObject.toString(), 0);
        } catch (Exception e) {
            log.error(e);
            return false;
        }
        return true;
    }
}
