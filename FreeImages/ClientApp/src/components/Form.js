
import { useState, useEffect } from 'react';

// Installed
import { Button, CircularProgress, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

// Components
import Response from './Response';

// Functions

function Form({ children, ...props }) {
    Form.displayName = "Form";

    const inputs = Object.keys(props.inputs);
    const [formData, setFormData] = useState(props.inputs);
    const [changed, setChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        let res = props.response;
        if (!!res) {
            setLoading(false);
            if (!!res?.alert) {
                setResponse(res);
                if (res.status === 200){
                    setLoading(false);
                    setFormData(props.inputs)
                }
            } else
                console.warn(res);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.response])

    const handleChange = e => {
        if (!e.target) return;
        setErrors([]);
        setChanged(true);
        setResponse(null);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const submitForm = async (e) => {
        e.preventDefault();

        setResponse();
        const confirm = props?.confirmInputs;

        // If exists inputs to validate
        if (!!props?.confirmInputs && formData[confirm[0]] !== formData[confirm[1]]) {
            setErrors(confirm);
            return;
        }

        // Form validation
        let invalidForm = false;
        inputs.forEach(input => {
            if (formData[input].length < 2) {
                invalidForm = true;
                setErrors(errors => [...errors, input])
            }
        })

        if (invalidForm) return;

        setLoading(true);
        props.onSubmit(formData);
    }

    const capitalize = (str) => {
        if (!str) return;
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const reload = () => {
        const pathname = loc.pathname;

        navigate("/reload", { replace: true })
        setTimeout(() => {
            return navigate(pathname);
        }, 100)
    }

    return (
        <form onSubmit={submitForm}>
            <h4 className='form-title'>{props.heading}</h4>
            {inputs.map((x, ind) => (
                <TextField key={ind}
                    label={capitalize(x)}
                    className='fields'
                    size="medium"
                    required
                    disabled={loading || props.disabled}
                    name={x}
                    type={x.toLowerCase().indexOf("password") > -1 ? "password" : (x === "email" ? x : "text")}
                    value={formData[x] || ""}
                    variant="outlined"
                    inputProps={{
                        minLength: x.toLowerCase().indexOf("password") > -1 ? 6 : 2
                    }}
                    error={errors.indexOf(x) > -1}
                    onChange={handleChange} />
            ))}

            {/* File upload */}
            {children && children}

            <div className="buttons-wrapper d-row jc-end">
                {changed && <Button color="error" variant='outlined' onClick={reload} disabled={loading}>
                    <Close />
                </Button>}
                <Button type="submit" variant='outlined' color="inherit" disabled={props.disabled || !changed}>
                    {loading ? <CircularProgress className='loading-circular' /> : "Save"}
                </Button>
            </div>

            {!!response && <Response res={response} close={() => setResponse()} />}
        </form>
    )
}
export default Form;