import React, { useEffect, useState } from "react"
import { DateTime } from "luxon"
import { Box } from "../../components/Box"
import { Column, Row } from "../../components/Layout"
import { Title } from "../../components/Title"
import { Chart } from "../../components/Chart/Chart"

import { useTVLOverTime } from "../../hooks/api/useTVLOverTime"

import styles from "./Overview.module.scss"
import CoveredProtocolsList from "../../components/CoveredProtocolsList/CoveredProtocolsList"
import { formatAmount } from "../../utils/format"
import useBalanceHistory, { useTVLBalances } from "../../hooks/useBalanceHistory"
import { AvailableERC20Tokens } from "../../hooks/useERC20"

type ChartDataPoint = {
    name: string
    value: number
}
type currency = {

}
const formatter = Intl.NumberFormat("en", { notation: "compact" })

export const OverviewPage: React.FC = () => {

    const [token, setToken] = useState<AvailableERC20Tokens>("USDC");
    const { TVLBalances } = useTVLBalances();
    const protocolsData = React.useMemo(() => {
        return [
            {
                name: "USDC",
                onClick: () => { setToken("USDC") },
                tvl: Number(TVLBalances["USDC"]),
                percentageOfTotal: 60,
            },
            {
                name: "WFTM",
                onClick: () => { setToken("WFTM") },
                tvl: Number(TVLBalances["WFTM"]),
                percentageOfTotal: 80,
            },
        ]
    }, [TVLBalances])

    const { loading, histories } = useBalanceHistory(token);

    useEffect(() => {
        console.log(histories)
    }, [histories])

    const hData = histories.timeStampHistories
        .map((timeStamp: any, index: number) => ({
            name: DateTime.fromMillis(Number(timeStamp) * 1000).toLocaleString({
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
            }),
            value:
                Number(histories.balanceHistories[index])
        }))

    return (
        <Column spacing="m" className={styles.container}>
            <Row>
                <Box shadow={false} fullWidth>
                    <Column spacing="m">
                        <Row>
                            <Title variant="h3">TOTAL LOCKED ({token})</Title>
                        </Row>
                        <Row>
                            <Title>{loading ? "loading" : hData && hData.length > 0 && `${formatter.format(hData[hData.length - 1].value)}`}</Title>
                        </Row>
                        <Row alignment="center">
                            <Chart
                                width={1000}
                                height={200}
                                loading={loading}
                                data={hData}
                                tooltipProps={{ formatter: (v: number, name: string) => [`${formatAmount(v, 0)}`, "TVC"] }}
                            />
                        </Row>
                    </Column>
                </Box>
            </Row>
            <Row spacing="m">
                <Column grow={1}>
                    <CoveredProtocolsList protocolsData={protocolsData} />
                </Column>
            </Row>
        </Column>
    )
}
