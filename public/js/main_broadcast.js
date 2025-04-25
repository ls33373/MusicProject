document.addEventListener("DOMContentLoaded", () => {
    let isAscending = true; // 기본값은 오름차순
    console.log("1")

    // 날짜 포맷팅 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear().toString().slice(-2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}.${month}.${day} ${hours}:${minutes}`;
    }

    // 정렬 아이콘 업데이트
    function updateSortIcon() {
        sortIcon.style.transform = isAscending ? 'rotate(0deg)' : 'rotate(180deg)';
        sortToggle.querySelector('span').textContent = isAscending ? '정렬 ↑' : '정렬 ↓';
    }

    // 정렬 토글 이벤트 처리
    sortToggle.addEventListener('click', () => {
        isAscending = !isAscending;
        updateSortIcon();
        loadRequests();
    });
    
    // 신청 목록 불러오기 (방송부)
    async function loadRequests_broadcast() {
        try {
            const requestList = document.getElementById('requestList-b');
            const response = await axios.get('/api/requests/broadcast');
            let requests = response.data;
            
            // 정렬 적용
            requests.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return isAscending ? dateA - dateB : dateB - dateA;
            });
            
            requestList.innerHTML = requests.map((request, index) => `
                <div class="border rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 song">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium text-gray-500">${isAscending ? index + 1 : requests.length - index}</span>
                                <h3 class="font-semibold">${request.title}</h3>
                                <span class="text-sm text-gray-500">-</span>
                                <span class="text-sm text-gray-500">${request.artist}</span>
                            </div>
                            <p class="text-gray-600 text-sm max-w-700">${request.reason}</p>
                        </div>
                        <div class="flex items-center flex-col gap-3">
                            <span class="text-xs text-gray-400 mt-1 lg:mt-0">${formatDate(request.createdAt)}</span>
                            <button onclick="deleteMusic(this)"
                                type="button"
                                class="rounded-md bg-red-500 text-white px-5 py-1 buttons"
                                id="${request.createdAt}">삭제</button>
                        </div>
                    </div>
                    
                </div>
            `).join('');

        } catch (error) {
            console.error('신청 목록을 불러오는데 실패했습니다:', error);
        }
    }

    // 초기 로드
    loadRequests_broadcast()
});