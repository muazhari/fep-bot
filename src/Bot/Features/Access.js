import { SharedProps, COMMAND_PREFIX } from "../../Bot";

export const Access = (Bot) => {
  const blacklist = () => {
    const { source } = Bot.props.event;
    const blocked_userIds = [];
    const blocked_groupIds = [
      "C7b132b65f0db5c28c4b7563bd348d168",
      "C2a14eb4c73958925b6a299fe6798b67b",
    ];
    const blocked_roomIds = ["R79ed98bf49e8cc183bd2af948f5bb297"];
    const blocked_types = [];

    const validate = {};

    if (source.userId) {
      validate["user"] = blocked_userIds.includes(source.userId);
    }
    if (source.groupId) {
      validate["group"] = blocked_groupIds.includes(source.groupId);
    }
    if (source.roomId) {
      validate["room"] = blocked_roomIds.includes(source.roomId);
    }
    if (source.type) {
      validate["type"] = blocked_types.includes(source.type);
    }

    // const validate = {validate_user, validate_group, validate_room, validate_type}

    return validate;
  };

  const whitelist = () => {
    const { source } = Bot.props.event;
    const allowed_userIds = ["U016bfe22df53b903b404a80efdd8ec65", "localuser"];
    const allowed_groupIds = ["C0fe1f8e3299d94ad839510f7674cd3e2"];
    const allowed_roomIds = ["R79ed98bf49e8cc183bd2af948f5bb297"];
    const allowed_types = [];

    const validate = {};

    if (source.userId) {
      validate["user"] = allowed_userIds.includes(source.userId);
    }
    if (source.groupId) {
      validate["group"] = allowed_groupIds.includes(source.groupId);
    }
    if (source.roomId) {
      validate["room"] = allowed_roomIds.includes(source.roomId);
    }
    if (source.type) {
      validate["type"] = allowed_types.includes(source.type);
    }

    // const validate = {validate_user, validate_group, validate_room, validate_type}
    return validate;
  };

  return { blacklist, whitelist };
};
