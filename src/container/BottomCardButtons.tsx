import React from 'react'
import './css/BottomCardButtons.css'

interface Props {
    onSkip: () => void;
    onCorrect: () => void;
    onError: () => void;
    onNewTurn: () => void;
    newButtonDisabled: boolean;
    pointButtonsDisabled: boolean;
}

const BottomCardButtons = ({ onSkip, onCorrect, onError, onNewTurn, newButtonDisabled, pointButtonsDisabled }: Props) => {
    return (
        <div className="panel">
            <button type="button" className="btn btn-primary btn-circle" disabled={!newButtonDisabled} onClick={() => onNewTurn()}>
                New
            </button>
            <button type="button" className="btn btn-success btn-circle" onClick={() => onCorrect()} disabled={pointButtonsDisabled}>
                Ok
            </button>
            <button type="button" className="btn btn-info btn-circle"><i className="fa fa-check"></i>
            </button>
            <button type="button" className="btn btn-warning btn-circle"><i className="fa fa-times"></i>
            </button>
            <button type="button" className="btn btn-danger btn-circle" onClick={() => onError()} disabled={pointButtonsDisabled}>
                X
            </button>

        </div>
    )
}

export default BottomCardButtons