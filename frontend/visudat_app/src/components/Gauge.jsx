import GaugeComponent from 'react-gauge-component'


function Gauge() {
    return (
        <div className='w-1/4'>
            <GaugeComponent type='radial' value={94}/>
        </div>
    )

}
export default Gauge