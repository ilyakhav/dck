import * as React from "react";
import * as ControlLabel from "react-bootstrap/lib/ControlLabel";
import * as FormControl from "react-bootstrap/lib/FormControl";
import * as Checkbox from "react-bootstrap/lib/Checkbox";
import * as FormGroup from "react-bootstrap/lib/FormGroup";
import * as HelpBlock from "react-bootstrap/lib/HelpBlock";
import * as InputGroup from "react-bootstrap/lib/InputGroup";
import * as FontAwesome from "react-fontawesome";
import * as DateTime from "react-datetime";

export type FieldInputType = "text" | "password" | "email" | "checkbox" | "datepicker";

export interface FieldGroupProps {
  type?: FieldInputType;
  placeholder?: string;
  id?: string;
  label?: string;
  help?: string;
  validationState?: any;
  validationMessage?: string;
  onFocus?: () => void;
  onChange?: (e: any) => void;
  value?: any;
  validationDebounceTimeout?: number
}

export class FieldGroup extends React.Component<FieldGroupProps, any> {
  public static defaultProps = {
    type: "text",
    validationDebounceTimeout: 1500,
  };

  constructor(props: any) {
    super(props);

    this.state = {
      showValidation: null,
      validationTimeout: null
    };
  }

  public getValidationState(validation: any) {
    if (!validation || this.state.showValidation === false) {
      return null;
    }

    if (validation.valid) {
      return "success";
    } else {
      return "error";
    }
  }

  onChange = (e: any) => {
    this.setState({showValidation: !!(this.props.validationState && this.props.validationState.valid)});

    if (!this.state.validationTimeout) {
      let timeout = setTimeout(() => {
          this.setState({showValidation: true});
          this.setState({validationTimeout: null});
      }, this.props.validationDebounceTimeout);
      this.setState({validationTimeout: timeout});
    }
    this.props.onChange(e);
  };

  public render() {
    return (
      <FormGroup
        controlId={this.props.id}
        validationState={this.getValidationState(this.props.validationState)}
      >
        <ControlLabel>{this.props.label}</ControlLabel>
        {this.props.type === "checkbox"? 

        <Checkbox value={this.props.value} onChange={this.props.onChange} /> :
        
        <FormControl
          onFocus={this.props.onFocus}
          onChange={this.onChange}
          type={this.props.type}
          placeholder={this.props.placeholder}
          value={this.props.value}
        />
        }
        
        {" "}
        {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
        {this.state.showValidation &&
        this.props.validationMessage &&
        this.props.validationState &&
        !this.props.validationState.valid ? (
          <HelpBlock>
            <FontAwesome name="exclamation-circle" />&nbsp;
            {this.props.validationMessage}
          </HelpBlock>
        ) : (
          <HelpBlock>&nbsp;</HelpBlock>
        )}
      </FormGroup>
    );
  }
}

export default FieldGroup;
