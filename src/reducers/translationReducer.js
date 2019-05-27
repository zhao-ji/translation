export default (state = {}, action) => {
    switch (action.type) {
        case 'GOOGLE_TRANSLATION':
            return {
                google: action.result
            }
        default:
            return state
    }
}
