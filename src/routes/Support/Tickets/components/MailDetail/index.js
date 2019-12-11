import React from "react";
import {Avatar, Checkbox, Dropdown, Menu} from "antd";
import CustomScrollbars from 'util/CustomScrollbars'

import labels from "../../data/labels";

class MailDetail extends React.Component {

  state = {
    showDetail: false
  };

  render() {
    const {mail, onStartSelect, onImportantSelect} = this.props;

    return (
      <div className="gx-module-detail gx-mail-detail">
        <CustomScrollbars className="gx-module-content-scroll">
          <div className="gx-mail-detail-inner">
            <div className="gx-mail-header">

              <div className="gx-mail-header-content gx-col gx-pl-0">
                <div className="gx-subject">
                  {mail.subject}
                </div>

                <div className="gx-labels">
                  {labels.map((label, index) => {
                    return (mail.labels).includes(label.id) && <div key={index}
                                                                    className={`gx-badge gx-text-white gx-bg-${label.color}`}>{label.title}</div>
                  })}
                </div>

              </div>

              <div className="gx-mail-header-actions">
                <div>
                   <i className="icon icon-reply gx-icon-btn"/>
                </div>
                <div onClick={() => {
                  onImportantSelect(mail);
                }}>

                  {mail.important ?
                    <i className="icon icon-important gx-icon-btn"/>
                    : <i className="icon icon-important-o gx-icon-btn"/>
                  }
                </div>
              </div>
            </div>

            <hr/>

            <div className="gx-mail-user-info gx-ml-0 gx-mr-3">
              <div className="gx-sender-name">{mail.from.name} (753609)</div>
            </div>

            <p>
              {mail.message}
            </p>

            {mail.hasAttachments &&
            <div className="gx-attachment-block">
              <h3>Attachments ({mail.attachments.length})</h3>
              <div className="gx-attachment-row">
                {mail.attachments.map((attachment, index) =>
                  <div className="gx-attachment-col" key={index}>
                    <img src={attachment.preview} alt={attachment.fileName}/>
                    <div className="size">{attachment.size}</div>
                  </div>
                )}
              </div>
            </div>
            }

            <h2>Replies (25)</h2>

            <div className="gx-module-list-item gx-mail-cell">
              <div className="gx-mail-list-info">
                <div className="gx-module-list-content">
                  <div className="gx-mail-user-des">
                    <span className="gx-sender-name">Admin</span>
                    <div className="gx-time">24 Dec</div>
                  </div>
                  <div className="gx-message">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus beatae doloremque eligendi est excepturi harum hic impedit libero nobis officia quaerat qui quibusdam, quis quo quos rem sit temporibus?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="gx-module-list-item gx-mail-cell">
              <div className="gx-mail-list-info">
                <div className="gx-module-list-content">
                  <div className="gx-mail-user-des">
                    <span className="gx-sender-name">Admin</span>
                    <div className="gx-time">24 Dec</div>
                  </div>
                  <div className="gx-message">
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, cumque dolor et itaque modi provident quisquam quos sit vero! Adipisci autem culpa cupiditate eveniet impedit maxime necessitatibus quidem unde vitae?</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="gx-module-list-item gx-mail-cell">
              <div className="gx-mail-list-info">
                <div className="gx-module-list-content">
                  <div className="gx-mail-user-des">
                    <span className="gx-sender-name">{mail.from.name} (753609)</span>
                    <div className="gx-time">24 Dec</div>
                  </div>
                  <div className="gx-message">
                    <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur, cumque dolor et itaque modi provident quisquam quos sit vero! Adipisci autem culpa cupiditate eveniet impedit maxime necessitatibus quidem unde vitae?</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </CustomScrollbars>
      </div>
    );
  }
}

export default MailDetail;
