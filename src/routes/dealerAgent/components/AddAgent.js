import React, { Component } from 'react';
import { Modal, message } from 'antd';
import AddAgentForm from './AddAgentForm';
import { convertToLang } from '../../utils/commonUtils';
import {
    Button_Ok,
    Button_Cancel,
    Button_Add_User
} from '../../../constants/ButtonConstants';

export default class AddAgent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handleSubmit: null,
            user: null,
            titleText: ''
        }
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        // console.log("change props")
        // if (this.props !== nextProps) {
        //     this.setState({
        //         addAgentModal: this.props.addAgentModal

        //     })
        // }
    }

    showModal = (handleSubmit, user = null, titleText = convertToLang(this.props.translation[Button_Add_User], "Add User")) => {
        // console.log(user);
        this.setState({
            visible: true,
            handleSubmit: handleSubmit,
            user: user,
            titleText: titleText,
        });

    }

    handleCancel = () => {
        // this.refs.add_user_form.resetFields();
        // this.setState({ visible: false });
    }
    render() {
        return (
            <div>
                <Modal
                    visible={this.props.addAgentModal}
                    title={"Add Agent"}
                    maskClosable={false}
                    // onOk={this.handleOk}
                    onCancel={() => this.props.handleAddUserModal(false)}
                    footer={null}
                    className="edit_form"
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <AddAgentForm
                        addAgentHandler={this.props.addAgentHandler}
                        // handleCancel={this.handleCancel}
                        handleAddUserModal = {this.props.handleAddUserModal}
                        // user={this.state.user}
                        ref='add_user_form'
                        translation={this.props.translation}
                    />
                </Modal>
            </div>
        )

    }
}
