import _iziToast from '../../common_css/iziToast/js/iziToast.min.js'
import '../../common_css/iziToast/css/iziToast.min.css'

const iziToast = {
    success: (arg) => {
        _iziToast.success({
            position: 'bottomRight',
            transitionIn: 'bounceInLeft',
            ...arg,
        })
    },
    warning: (arg) => {
        _iziToast.warning({
            position: 'bottomRight',
            transitionIn: 'bounceInLeft',
            ...arg,
        })
    },
    error: (arg) => {
        _iziToast.error({
            position: 'bottomRight',
            transitionIn: 'bounceInLeft',
            ...arg,
        })
    },
}

// iziToast.success({
//     title: '成功',
//     message: '评论成功',
//     position: 'bottomRight',
//     transitionIn: 'bounceInLeft',
// })

export default iziToast;