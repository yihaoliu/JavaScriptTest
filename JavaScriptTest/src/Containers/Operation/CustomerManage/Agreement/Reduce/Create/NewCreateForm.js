import React, {
	Component,
	PropTypes
} from 'react';
import {
	connect
} from 'kr/Redux';
import Param from 'jquery-param';
import {
	Binder
} from 'react-binding';
import ReactMixin from "react-mixin";
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import dateFormat from 'dateformat';

import {
	reduxForm,
	formValueSelector,
	change,
	initialize,
	arrayPush,
	arrayInsert,
	FieldArray,

} from 'redux-form';

import {
	Actions,
	Store
} from 'kr/Redux';

import AllStation from './AllStation';

import {
	Menu,
	MenuItem,
	DropDownMenu,
	IconMenu,
	Dialog,

	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
	TableFooter,
	Section,
	KrField,
	Grid,
	Row,
	Col,
	Button,
	Notify,
	DotTitle,
	KrDate,
	ButtonGroup,
	Paper,
	ListGroup,
	ListGroupItem,
	CircleStyle
} from 'kr-ui';

@ReactMixin.decorate(LinkedStateMixin)
class NewCreateForm extends Component {

	static DefaultPropTypes = {
		initialValues: {
			customerName: '',
			communityName: '',
			lessorAddress: '',
			payTypeList: [],
			paymentList: [],
			fnaCorporationList: [],
		}
	}

	static PropTypes = {
		initialValues: React.PropTypes.object,
		onSubmit: React.PropTypes.func,
		onCancel: React.PropTypes.func,
	}

	static contextTypes = {
		params: React.PropTypes.object.isRequired
	}

	constructor(props, context) {
		super(props, context);


		console.log("----thisconte", this.context);



		//stationsRefs表单
		this.stationRefs = {};

		this.onCancel = this.onCancel.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.onStationSubmit = this.onStationSubmit.bind(this);
		this.onStationCancel = this.onStationCancel.bind(this);

		this.onStationDelete = this.onStationDelete.bind(this);
		this.onStationSelect = this.onStationSelect.bind(this);

		this.openStationDialog = this.openStationDialog.bind(this);
		this.openStationUnitPriceDialog = this.openStationUnitPriceDialog.bind(this);
		this.onChangeSearchPersonel = this.onChangeSearchPersonel.bind(this);
		this.onStationVosChange = this.onStationVosChange.bind(this);

		this.state = {
			stationVos: [],
			selectedStation: [],
			openStation: false,
			openStationUnitPrice: false,
		}
	}

	onStationVosChange(index, value) {
		let {
			stationVos
		} = this.state;
		stationVos[index].unitprice = value;
		this.setState({
			stationVos
		});
	}

	onChangeSearchPersonel(personel) {
		Store.dispatch(change('reduceCreateForm', 'lessorContacttel', personel.mobile));
	}

	//录入单价dialog
	openStationUnitPriceDialog() {
		this.setState({
			openStationUnitPrice: !this.state.openStationUnitPrice
		});
	}

	onChangeSearchPersonel(personel) {
		Store.dispatch(change('reduceCreateForm', 'lessorContacttel', personel.mobile));
		Store.dispatch(change('reduceCreateForm', 'lessorContactName', personel.lastname));
	}

	onStationCancel() {
		this.openStationDialog();
	}

	onStationSubmit(stationVos) {

		this.setState({
			stationVos
		});
		this.openStationDialog();
	}


	//删除工位
	onStationDelete() {

		let {
			selectedStation,
			stationVos
		} = this.state;
		stationVos = stationVos.filter(function(item, index) {

			if (selectedStation.indexOf(index) != -1) {
				return false;
			}
			return true;
		});
		this.setState({
			stationVos
		});
	}

	onStationSelect(selectedStation) {
		this.setState({
			selectedStation
		})
	}

	openStationDialog() {
		this.setState({
			openStation: !this.state.openStation
		});
	}

	componentDidMount() {
		let {
			initialValues
		} = this.props;
		Store.dispatch(initialize('reduceCreateForm', initialValues));
	}

	componentWillReceiveProps(nextProps) {

	}

	onSubmit(form) {

		form = Object.assign({}, form);

		let {
			changeValues
		} = this.props;

		let {
			stationVos
		} = this.state;

		if (!stationVos.length) {
			Notify.show([{
				message: '请选择工位',
				type: 'danger',
			}]);
			return;
		}

		form.list = stationVos;
		form.signdate = dateFormat(form.signdate, "yyyy-mm-dd hh:MM:ss");
		form.lessorAddress = changeValues.lessorAddress;

		form.leaseBegindate = dateFormat(stationVos[0].leaseBeginDate, "yyyy-mm-dd hh:MM:ss");
		form.leaseEnddate = dateFormat(stationVos[0].leaseEndDate, "yyyy-mm-dd hh:MM:ss");


		form.stationVos = stationVos;

		form.stationVos = JSON.stringify(form.stationVos);

		const {
			onSubmit
		} = this.props;
		onSubmit && onSubmit(form);
	}

	onCancel() {
		const {
			onCancel
		} = this.props;
		onCancel && onCancel();
	}

	render() {

		let {
			error,
			handleSubmit,
			pristine,
			reset,
			submitting,
			initialValues,
			changeValues,
			optionValues
		} = this.props;

		let {
			fnaCorporationList
		} = optionValues;

		fnaCorporationList && fnaCorporationList.map(function(item, index) {
			if (changeValues.leaseId == item.id) {
				changeValues.lessorAddress = item.corporationAddress;
			}
		});

		let {
			stationVos
		} = this.state;
		return (
			<Paper width={960}>

	<form onSubmit={handleSubmit(this.onSubmit)}>
				<CircleStyle num="1" info="租赁明细" >
				<div className="detailList" style={{marginTop:"-40px"}}>	
				<DotTitle title='租赁明细'>
				       <Grid style={{marginTop:"-40px"}}>
							<Row>
								<Col align="right">
									<ButtonGroup>
										<Button label="减租"  onTouchTap={this.openStationDialog} />
										<Button label="删除" height={27} cancle={true} type="button"  onTouchTap={this.onStationDelete} />
								  </ButtonGroup>
								</Col>
							</Row>
						</Grid>
			<div style={{marginTop:"-10px"}}>
				<Table  displayCheckbox={true} onSelect={this.onStationSelect}>
				<TableHeader>
				<TableHeaderColumn>类别</TableHeaderColumn>
				<TableHeaderColumn>编号／名称</TableHeaderColumn>
				<TableHeaderColumn>单价(元/月)</TableHeaderColumn>
					<TableHeaderColumn>减租开始时间</TableHeaderColumn>
						<TableHeaderColumn>减租结束日期</TableHeaderColumn>
						</TableHeader>
						<TableBody>
						{stationVos.map((item,index)=>{
							return (
								<TableRow key={index}>
									<TableRowColumn>{(item.stationType == 1) ?'工位':'会议室'}</TableRowColumn>
									<TableRowColumn>{item.stationName}</TableRowColumn>
									<TableRowColumn>
											{item.unitprice}
									</TableRowColumn>
									<TableRowColumn> <KrDate value={item.leaseBeginDate}/></TableRowColumn>
									<TableRowColumn><KrDate value={item.leaseEndDate}/></TableRowColumn>

									</TableRow>
							);
						})}
						</TableBody>
						</Table>
						</div>

                     </DotTitle>
                     </div>
					</CircleStyle>
					<CircleStyle num="2" info="合同文本信息" circle="bottom">
				<KrField grid={1/2}  name="mainbillid" type="hidden" component="input" />
				<KrField grid={1/2}  name="contractstate" type="hidden" component="input" />
				<KrField grid={1/2}  name="contracttype" type="hidden" component="input" />
				<KrField grid={1/2}  name="leaseEnddate" type="hidden" component="input" />
				<KrField grid={1/2}  name="leaseBegindate" type="hidden" component="input" />

				<KrField style={{width:370,marginLeft:70}} name="leaseId" component="select" label="出租方" options={optionValues.fnaCorporationList} requireLabel={true} />
				<KrField style={{width:370,marginLeft:90}} name="lessorAddress" type="text" component="labelText" inline={false} label="地址" value={changeValues.lessorAddress}  defaultValue="无"/>
				<KrField style={{width:370,marginLeft:70}}  name="lessorContactid" component="searchPersonel" label="联系人" onChange={this.onChangeSearchPersonel} requireLabel={true}/>
				<KrField style={{width:370,marginLeft:90}} name="lessorContacttel" type="text" component="input" label="电话" requireLabel={true}
				requiredValue={true} pattern={/(^((\+86)|(86))?[1][3456789][0-9]{9}$)|(^(0\d{2,3}-\d{7,8})(-\d{1,4})?$)/} errors={{requiredValue:'电话号码为必填项',pattern:'请输入正确电话号'}}/>

				<KrField style={{width:370,marginLeft:70}}  component="labelText" label="承租方" inline={false} value={optionValues.customerName}/>

				<KrField style={{width:370,marginLeft:90}}  name="leaseAddress" type="text" component="input" label="地址" requireLabel={true}
				requiredValue={true} pattern={/^.{0,120}$/} errors={{requiredValue:'地址为必填项',pattern:'地址最大60位'}} />

				<KrField style={{width:370,marginLeft:70}}  name="leaseContact" type="text" component="input" label="联系人" requireLabel={true}
				requiredValue={true} pattern={/^.{0,20}$/} errors={{requiredValue:'联系人为必填项',pattern:'联系人最大20位'}} />
				<KrField style={{width:370,marginLeft:90}}  name="leaseContacttel" type="text" component="input" label="电话" requireLabel={true}
				requiredValue={true} pattern={/(^((\+86)|(86))?[1][3456789][0-9]{9}$)|(^(0\d{2,3}-\d{7,8})(-\d{1,4})?$)/} errors={{requiredValue:'电话号码为必填项',pattern:'请输入正确电话号'}}/>

				<KrField style={{width:370,marginLeft:70}}  name="communityid" component="labelText" label="所属社区" inline={false} value={optionValues.communityName} />

				<KrField style={{width:370,marginLeft:90}}  name="communityAddress" component="labelText" label="地址" inline={false} value={optionValues.communityAddress} />
				<KrField style={{width:370,marginLeft:70}} name="contractcode" type="text" component="input" label="合同编号" requireLabel={true}
				requiredValue={true} pattern={/^.{0,50}$/} errors={{requiredValue:'合同编号为必填项',pattern:'合同编号最大50位'}} />

				<KrField style={{width:370,marginLeft:90}} name="signdate"  component="date"  label="签署时间" requireLabel={true}/>

				<KrField style={{width:370,marginLeft:70}} name="rentamount" component="input" type="text" requireLabel={true} label="减租金额"
				requiredValue={true} pattern={/^\d{0,16}(\.\d{0,2})?$/} errors={{requiredValue:'减租金额为必填项',pattern:'请输入正数金额，小数点后最多两位'}} />

				<KrField  style={{width:830,marginLeft:70}} name="contractmark" component="textarea" label="备注" maxSize={200}/>
				</CircleStyle>
				<KrField  style={{width:830,marginLeft:90,marginTop:'-20px'}}   name="contractFileList" component="input" type="hidden" label="合同附件"/>
				<KrField style={{width:830,marginLeft:90,marginTop:'-20px'}}  name="fileIdList" component="file" label="合同附件" requireLabel={true} defaultValue={[]} onChange={(files)=>{
					Store.dispatch(change('reduceCreateForm','contractFileList',files));
				}} />
              
                     	<div style={{padding:"10px 0 50px"}}>
						<Grid >
						<Row >
						<ListGroup>
							<ListGroupItem style={{width:'45%',textAlign:'right',paddingRight:15}}><Button  label="确定" type="submit" disabled={pristine || submitting} width={100} height={40} fontSize={16} /></ListGroupItem>
							<ListGroupItem style={{width:'45%',textAlign:'left',paddingLeft:15}}><Button  label="取消" cancle={true} type="button"  onTouchTap={this.onCancel} width={100} height={40} fontSize={16}/></ListGroupItem>
						</ListGroup>
						</Row>
						</Grid>
						</div>

						</form>

					<Dialog
						title="分配工位"
						open={this.state.openStation}
						modal={true}
						autoScrollBodyContent={true}
						autoDetectWindowHeight={true}
						onClose={this.onStationCancel}>
								<AllStation onSubmit={this.onStationSubmit} onCancel={this.onStationCancel}    params= {this.props.params}/>
					  </Dialog>


			</Paper>);
	}
}
const selector = formValueSelector('reduceCreateForm');
const validate = values => {

	const errors = {}

	if (!values.leaseId) {
		errors.leaseId = '请填写出租方';
	}

	if (!values.lessorContactid) {
		errors.lessorContactid = '请填写出租方联系人';
	}

	if (!values.lessorContacttel) {
		errors.lessorContacttel = '请填写出租方联系电话';
	}

	if (!values.leaseAddress) {
		errors.leaseAddress = '请填写承租方地址';
	}
	if (!values.wherefloor) {
		errors.wherefloor = '请先选择楼层';
	}

	if (!values.leaseContacttel) {
		errors.leaseContacttel = '请填写承租方电话';
	}

	if (!values.leaseAddress) {
		errors.leaseAddress = '请填写承租方地址';
	}

	if (values.leaseAddress && !isNaN(values.leaseAddress)) {
		errors.leaseAddress = '承租方地址不能为数字';
	}

	if (!values.leaseContact) {
		errors.leaseContact = '请填写承租方联系人';
	}

	if (!values.fileIdList) {
		errors.fileIdList = '请填写合同附件';
	}



	if (!values.signdate) {
		errors.signdate = '请填写签署时间';
	}

	if (!values.contractcode) {
		errors.contractcode = '请填写合同编号';
	}


	return errors
}
NewCreateForm = reduxForm({
	form: 'reduceCreateForm',
	validate,
	enableReinitialize: true,
	keepDirtyOnReinitialize: true
})(NewCreateForm);

export default connect((state) => {

	let changeValues = {};

	changeValues.lessorId = selector(state, 'lessorId');
	changeValues.leaseId = selector(state, 'leaseId');
	changeValues.stationnum = selector(state, 'stationnum') || 0;
	changeValues.boardroomnum = selector(state, 'boardroomnum') || 0;
	changeValues.leaseBegindate = selector(state, 'leaseBegindate');
	changeValues.leaseEnddate = selector(state, 'leaseEnddate');
	changeValues.wherefloor = selector(state, 'wherefloor') || 0;

	return {
		changeValues
	}

})(NewCreateForm);