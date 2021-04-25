import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import {
    Button,
    Div,
    FixedLayout,
    FormItem,
    FormLayout,
    Group,
    Header,
    Input,
    Link,
    Panel,
    PanelHeader,
    Placeholder,
    SimpleCell,
    Snackbar,
    Textarea
} from "@vkontakte/vkui";

import Icon16ErrorCircleFill from '@vkontakte/icons/dist/16/error_circle_fill';
import Icon20CheckCircleFillGreen from '@vkontakte/icons/dist/20/check_circle_fill_green';

import { Icon16Chevron, Icon28QuestionOutline } from '@vkontakte/icons';

var questions = ['Как зарегистрироваться?', 'Как написать в поддержку?', 'Что делать, если я забыл пароль?', 'Что делать, если на мой номер уже зарегистрирован аккаунт?']

class HomePanelBase extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            snackbar: null,
            number: '',
            name: '',
            text: ''
        };

        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
    }

    showError(text) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
        <Snackbar
            layout="vertical"
            style={{ padding: 0 }}
            onClose={() => this.setState({ snackbar: null })}
            before={<Icon16ErrorCircleFill width={24} height={24} />}
        >
            {text}
        </Snackbar>
        });
    }

    showSuccess(text) {
        if (this.state.snackbar) return;
        this.setState({ snackbar:
        <Snackbar
            layout="vertical"
            style={{ padding: 0 }}
            onClose={() => this.setState({ snackbar: null })}
            before={<Icon20CheckCircleFillGreen width={24} height={24} />}
        >
            {text}
        </Snackbar>
        });
    }

    componentDidMount() {
    }

    sendRequest() {
        if(this.state.name.trim() === '' || this.state.text.trim() === '' || this.state.number.trim() === '') {
            this.showError('Пожалуйста, заполните все поля.');
        } else if(this.state.name.split(' ').length != 3) {
            this.showError('Пожалуйста, проверьте правильность заполнения поля "ФИО".');
        } else if(this.state.number.length != 12) {
            this.showError('Пожалуйста, проверьте правильность заполнения поля "Номер телефона".');
        }

        fetch('https://evgrg.000webhostapp.com/testapi.php?action=saveUser&firstName=' + this.state.name.split(' ')[1] + '&lastName=' + this.state.name.split(' ')[0] + '&middleName=' + this.state.name.split(' ')[2] + '&phone=' + this.state.number + '&text=' + this.state.text).then(response => response.text())
        .then((data) => {
            data = JSON.parse(data);
            if(data.result) {
                this.showSuccess('Ваше оборащение успешно отправлено!');
                this.setState({
                    name: '',
                    number: '',
                    text: ''
                });
            } else {
                this.showError('Что-то пошло не так. Повторите, пожалуйста, попытку ещё раз.');
            }
        });
    }

    render() {
        const {id, setPage, withoutEpic} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader>Обращение в поддержку</PanelHeader>
                <Group header={<Header mode="primary">Частозадаваемые вопросы</Header>} description={<Link>Весь список вопросов <Icon16Chevron /></Link>}>
                    {questions.map((item) => <SimpleCell multiline before={<Icon28QuestionOutline/>}>
                        {item}
                    </SimpleCell>)}
                </Group>
                <Group header={<Header mode="primary">Новый вопрос</Header>}>
                    <FormLayout style={{ marginBottom: 16 }}>
                        <FormItem top="ФИО" bottom="Введите, пожалуйста, своё ФИО, чтобы мы знали, как к вам можно обращаться">
                            <Input onChange={(e) => {
                                this.setState({
                                    name: e.target.value.substring(0, 63)
                                })
                            }} value={this.state.name} placeholder="Иванов Иван Иванович"/>
                        </FormItem>
                        <FormItem top="Номер телефона" bottom="В международном формате, начиная с +7">
                            <Input onChange={(e) => {
                                this.setState({
                                    number: e.target.value.replace(/[^\d.()-+]/g, '').substring(0, 12)
                                })
                            }} value={this.state.number} placeholder="+79040000000" type="tel" />
                        </FormItem>
                        <FormItem top="Текст обращения" bottom="Не более 300 символов">
                            <Textarea onChange={(e) => {
                                this.setState({
                                    text: e.target.value.substring(0, 299)
                                })
                            }} value={this.state.text} placeholder="Подробно расскажите о вашей проблеме" />
                        </FormItem>
                    </FormLayout>
                    <FixedLayout filled style={{ paddingBottom: 0 }} vertical="bottom">
                        <Div>
                            <Button onClick={() => this.sendRequest()} size="l" stretched>
                                Отправить вопрос
                            </Button>
                        </Div>
                    </FixedLayout>
                </Group>
                {this.state.snackbar}
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack,
    openPopout,
    closePopout,
    openModal
};

export default connect(null, mapDispatchToProps)(HomePanelBase);
