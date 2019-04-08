import React, { Component } from 'react';
import { Modal, message, Radio, Button } from 'antd';
// import EditForm from './editForm';
// let editDevice;
export default class FlagDevice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModel = (device, func) => {
        // console.log('device Detail', device)
        // alert('its working')
        // editDevice = func;
        this.setState({

            device: device,
            visible: true,
            func: func,

        });

    }


    handleCancel = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, loading } = this.state;

        return (
            <div>
                <Modal
                    visible={visible}
                    title="Flag Device"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="Flag Device"
                >
                    <div>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                            <Radio.Button value="a">Stolen</Radio.Button>
                            <Radio.Button value="b">Damage</Radio.Button>
                            <Radio.Button value="c">Lost</Radio.Button>
                            <Radio.Button value="d">Defective</Radio.Button>
                        </Radio.Group>

                        <div style={{ float: "Right" }}>
                            <Button>Cancel</Button>
                            <Button>Flag Device</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        )

    }
}