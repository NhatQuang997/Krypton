import {CircularProgress} from "@chakra-ui/react";
import './loading.scss'

export default function Loading() {
    return <div className="loading">
        <CircularProgress isIndeterminate color='green.300' />
      </div>
}