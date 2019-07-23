import Bot from "../Bot";

export default class Access extends Bot.Commands {
  constructor(props) {
    super(props);
    this.event = this.props.event;
  }

  blacklist_check = () => {
    const { source } = this.event;
    const blocked_ids = [
      "C7b132b65f0db5c28c4b7563bd348d168",
      "C2a14eb4c73958925b6a299fe6798b67b"
    ];
    const blocked_types = [];
    const validate_sender =
      blocked_ids.includes(source.userId) &&
      blocked_types.includes(source.type);
    return validate_sender;
  };

  whitelist_check = () => {
    const { source } = this.event;
    const allowed_ids = ["U016bfe22df53b903b404a80efdd8ec65", "localuser"];
    const allowed_types = [];
    const validate_sender =
      allowed_ids.includes(source.userId) &&
      allowed_types.includes(source.type);
    return validate_sender;
  };
}
