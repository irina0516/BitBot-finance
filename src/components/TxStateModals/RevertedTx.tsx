import React from "react"
import ErrorIcon from "../ErrorIcon/ErrorIcon"
import { Column } from "../Layout"
import Modal from "../Modal/Modal"
import { Text } from "../Text"
import TxHash from "./TxHash"

interface Props {
    /**
     * Transaction hash
     */
    hash?: string
    error?: string
}

const RevertedTx: React.FC<Props> = ({ hash, error }) => {
    return (
        <Modal closeable>
            <Column spacing="m" alignment="center">
                <ErrorIcon />
                <Text strong size="large">
                    {error !== "" ? error : "Transaction was reverted"}.
                </Text>
                <Text>For some reason, the transaction did not make it's way on the blockchain.</Text>
                <Text>Check the transaction logs for any clues on what happened.</Text>
                {hash && <TxHash hash={hash} />}
            </Column>
        </Modal>
    )
}

export default RevertedTx
