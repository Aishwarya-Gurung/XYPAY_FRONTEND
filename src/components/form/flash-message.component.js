import React, { Component } from 'react';
import { node, number, bool, string } from 'prop-types';

class FlashMessage extends Component {
  state = { isVisible: true };

  componentDidMount = () => {
    this.remaining = this.props.duration;
    this.resumeTimer();
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  resumeTimer = () => {
    window.clearTimeout(this.timer);

    this.start = new Date();
    this.timer = setTimeout(this.hide, this.remaining);
  };

  pauseTimer = () => {
    if (this.props.persistOnHover) {
      clearTimeout(this.timer);

      this.remaining -= new Date() - this.start;
    }
  };

  render() {
    const { isVisible } = this.state;
    const { children, className } = this.props;

    return isVisible ? (
      <div
        className={`flash-popup-message ${className}`}
        onMouseEnter={this.pauseTimer}
        onMouseLeave={this.resumeTimer}
      >
        {children}
      </div>
    ) : null;
  }
}

FlashMessage.defaultProps = {
  duration: 5000,
  children: null,
  persistOnHover: true,
  className: 'alert alert-info',
};

FlashMessage.propTypes = {
  children: node,
  duration: number,
  className: string,
  persistOnHover: bool,
};

export default FlashMessage;
