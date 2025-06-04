import VIET_NAME_LOCATION from '../../data/vietnam-location.json';


export function findProvinceByCode(code: any) {
    return VIET_NAME_LOCATION.find((province) => province.code === code);
}

export function findDistrictByCode(provinceCode : any, districtCode: any) {
    const province = findProvinceByCode(provinceCode);
    return province?.districts.find((district) => district.code === districtCode);
}


export function getListDistrictsOf(provinceCode: any) {
    const province = findProvinceByCode(provinceCode);
    return province?.districts.map((district) => ({
        name: district.name,
        code: district.code,
    })) || [];
}


export function getListWardsOf(provinceCode: any, districtCode: any) {
    const district = findDistrictByCode(provinceCode, districtCode);
    return district?.wards.map((ward) => ({
        name: ward.name,
        code: ward.code,
    })) || [];
}


// Không cần ép kiểu nếu code là string
export function getFullAddress(provinceCode: string, districtCode: string, wardCode: string) {
    const provinceCodeNum = Number(provinceCode);
    const districtCodeNum = Number(districtCode);
    const wardCodeNum = Number(wardCode);

    const province = findProvinceByCode(provinceCodeNum);
    const district = findDistrictByCode(provinceCodeNum, districtCodeNum);
    const wards = getListWardsOf(provinceCodeNum, districtCodeNum);
    const ward = wards.find(w => w.code === wardCodeNum);


    return {
        province: province?.name || "Không tìm thấy",
        district: district?.name || "Không tìm thấy",
        ward: ward?.name || "Không tìm thấy",
    };
}


